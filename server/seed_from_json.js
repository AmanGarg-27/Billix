const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

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

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seedProducts() {
  try {
    if (!process.env.MONGO_URI) {
      console.log('Error: MONGO_URI missing in .env');
      process.exit(1);
    }
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Load products from JSON
    const jsonPath = path.join(__dirname, '..', 'products.json');
    const productsRaw = fs.readFileSync(jsonPath, 'utf8');
    const productsData = JSON.parse(productsRaw);

    // Insert new products
    await Product.insertMany(productsData);
    console.log(`Successfully inserted ${productsData.length} new products into the database!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedProducts();
