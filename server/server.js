const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Product Model
const ProductSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 },
  storeId: { type: String, default: "Main Store" }
});

const Product = mongoose.model('Product', ProductSchema);

// Store Model
const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  image: { type: String },
  coordinates: {
    lat: Number,
    lng: Number
  }
});

const Store = mongoose.model('Store', StoreSchema);

// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: { type: String, default: "New Delhi, India" },
  points: { type: Number, default: 0 },
  avatar: { type: String },
  addresses: [{ type: String }],
  paymentMethods: [{ type: String }],
  currentStore: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  joinedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Order Model
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ 
    name: String, 
    price: Number, 
    quantity: Number,
    image: String 
  }],
  total: Number,
  status: { type: String, default: 'Delivered' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Collaborative Cart Session Schema
const CartSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  items: [{ 
    id: String,
    name: String, 
    price: Number, 
    quantity: Number,
    image: String 
  }],
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Session auto-deletes in 24 hours
});

const CartSession = mongoose.model('CartSession', CartSessionSchema);

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const { storeId } = req.query;
    let query = {};
    if (storeId) {
      query.storeId = storeId;
    }
    let products = await Product.find(query);
    
    // Dynamic Fallback: If no products are explicitly mapped to the selected store in the DB,
    // fetch all products and dynamically map their storeId so the UI remains fully loaded!
    if (products.length === 0) {
      const allProds = await Product.find({});
      products = allProds.map(p => {
        const pObj = p.toObject();
        if (storeId) pObj.storeId = storeId;
        return pObj;
      });
    }
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Fetch All Stores Endpoint
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await Store.find({});
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Update User Active Store Endpoint
app.put('/api/user/store', async (req, res) => {
  try {
    const { storeId } = req.body;
    let user = await User.findOne({ email: "aman@billix.com" });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.currentStore = storeId;
    await user.save();
    
    user = await User.findById(user._id).populate('currentStore');
    console.log(`[Backend] User ${user.name} active store updated to ${user.currentStore?.name}`);
    res.json(user);
  } catch (err) {
    console.error("[Backend] Failed to update active store:", err);
    res.status(500).json({ message: 'Failed to update store', error: err });
  }
});

app.get('/api/products/:barcode', async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// User Profile Endpoint
app.get('/api/user', async (req, res) => {
  try {
    let stores = await Store.find();
    
    let user = await User.findOne({ email: "aman@billix.com" }).populate('currentStore');
    if (!user) {
      user = new User({
        name: "Aman Gupta",
        email: "aman@billix.com",
        location: "New Delhi, India",
        points: 850,
        avatar: "A",
        addresses: ["House #101, Sector 15, Rohini, New Delhi", "Office: Billix HQ, DLF Cyber City, Gurgaon"],
        paymentMethods: ["Visa •••• 4242", "UPI: aman@okaxis"],
        currentStore: stores.length > 0 ? stores[0]._id : null
      });
      await user.save();
      user = await User.findById(user._id).populate('currentStore');
    } else if (!user.currentStore && stores.length > 0) {
      user.currentStore = stores[0]._id;
      await user.save();
      user = await User.findById(user._id).populate('currentStore');
    }
    console.log(`[Backend] Returning user ${user.name}, currentStore: ${user.currentStore?.name || 'NONE'}`);
    res.json(user);
  } catch (err) {
    console.error("[Backend] User fetch error:", err);
    res.status(500).json({ message: 'User fetch failed', error: err });
  }
});

// Update User Profile Endpoint
app.put('/api/user', async (req, res) => {
  try {
    const { name, location, avatar } = req.body;
    const user = await User.findOneAndUpdate(
      { email: "aman@billix.com" },
      { name, location, avatar },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err });
  }
});

// Order History Endpoint
app.get('/api/user/orders', async (req, res) => {
  try {
    const user = await User.findOne({ email: "aman@billix.com" });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    let orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
    if (orders.length === 0) {
      // Auto-seed some mock orders for demo
      const mockOrders = [
        {
          userId: user._id,
          total: 1250,
          items: [{ name: "Organic Bananas", price: 50, quantity: 2, image: "https://loremflickr.com/400/400/grocery,banana" }],
          status: 'Delivered',
          createdAt: new Date(Date.now() - 86400000 * 2)
        },
        {
          userId: user._id,
          total: 840,
          items: [{ name: "Dark Chocolate", price: 120, quantity: 1, image: "https://loremflickr.com/400/400/grocery,chocolate" }],
          status: 'Delivered',
          createdAt: new Date(Date.now() - 86400000 * 5)
        }
      ];
      orders = await Order.insertMany(mockOrders);
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Orders fetch failed', error: err });
  }
});

// Checkout / Create Order Endpoint
app.post('/api/user/orders', async (req, res) => {
  try {
    const { items, total, paymentMethod } = req.body;
    let user = await User.findOne({ email: "aman@billix.com" });
    if (!user) {
      let stores = await Store.find();
      user = new User({
        name: "Aman Gupta",
        email: "aman@billix.com",
        location: "New Delhi, India",
        points: 0,
        avatar: "A",
        currentStore: stores.length > 0 ? stores[0]._id : null
      });
      await user.save();
    }
    
    // Create new order with status depending on payment method
    const order = new Order({
      userId: user._id,
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: total,
      status: paymentMethod === 'Cash' ? 'Pending Cash' : 'Verified'
    });
    await order.save();
    
    // Reward points: 10% of total INR value
    const pointsEarned = Math.round(total * 0.1);
    user.points += pointsEarned;
    await user.save();
    
    console.log(`[Backend] Order created: ${order._id}, paymentMethod: ${paymentMethod}, status: ${order.status}, points awarded: ${pointsEarned}, user total: ${user.points}`);
    res.status(201).json(order);
  } catch (err) {
    console.error("[Backend] Checkout error:", err);
    res.status(500).json({ message: 'Checkout failed', error: err });
  }
});

// Fetch Single Order for Exit Guard Verification
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('userId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error("[Backend] Order fetch error:", err);
    res.status(500).json({ message: 'Order fetch failed', error: err });
  }
});

// Mark Order as Audited/Completed by Guard
app.put('/api/orders/:orderId/verify', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: 'Audited' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(`[Backend] Order audited/completed by guard: ${order._id}`);
    res.json(order);
  } catch (err) {
    console.error("[Backend] Order verification error:", err);
    res.status(500).json({ message: 'Order verification failed', error: err });
  }
});

// Mark Cash Order as Paid by Cashier
app.put('/api/orders/:orderId/verify-cash', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: 'Verified' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(`[Backend] Order cash payment verified by cashier: ${order._id}`);
    res.json(order);
  } catch (err) {
    console.error("[Backend] Order cash verification error:", err);
    res.status(500).json({ message: 'Order cash verification failed', error: err });
  }
});

// Initialize Collaborative Cart Share Session
app.post('/api/cart/share', async (req, res) => {
  try {
    const { items } = req.body;
    // Generate a random 6-digit session ID
    const sessionId = Math.floor(100000 + Math.random() * 900000).toString();
    const session = new CartSession({
      sessionId: sessionId,
      items: items || []
    });
    await session.save();
    console.log(`[Backend] Collaborative Cart Session created: ${sessionId}`);
    res.status(201).json(session);
  } catch (err) {
    console.error("[Backend] Cart session creation failed:", err);
    res.status(500).json({ message: 'Failed to create shared cart session', error: err });
  }
});

// Fetch Collaborative Cart Items
app.get('/api/cart/share/:sessionId', async (req, res) => {
  try {
    const session = await CartSession.findOne({ sessionId: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Cart session not found' });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart session', error: err });
  }
});

// Update Shared Cart Items
app.put('/api/cart/share/:sessionId', async (req, res) => {
  try {
    const { items } = req.body;
    const session = await CartSession.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { items: items },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: 'Cart session not found' });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update shared cart', error: err });
  }
});

// Serve static assets in production (when not running on Vercel)
if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} (Listening on all interfaces)`);
});

module.exports = app;
