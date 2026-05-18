const mongoose = require('mongoose');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 20000, // Wait 20 seconds for connection
  heartbeatFrequencyMS: 2000 // Check heartbeats every 2 seconds
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

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

const brands = ['Amul', 'Britannia', 'Parle', 'Haldiram', 'Aashirvaad', 'Tata', 'MTR', 'Maggi', 'Kissan', 'Everest', 'MDH', 'Patanjali', 'Dabur', 'Himalaya', 'Nivea', 'Dove', 'Surf Excel', 'Ariel', 'Colgate', 'Pepsodent', 'Dettol', 'Lifebuoy', 'Sunsilk', 'Clinic Plus', 'Head & Shoulders', 'Pampers', 'MamyPoko', 'Horlicks', 'Bournvita', 'Complan', 'Lays', 'Kurkure', 'Bingo', 'Paper Boat', 'Real', 'Tropicana', 'Bisleri', 'Kinley', 'Aquafina', 'Coke', 'Pepsi', 'Sprite', 'Thums Up', 'Gowardhan', 'Mother Dairy', 'Fortune', 'Saffola', 'Sundrop', 'Dhara', 'India Gate', 'Kohinoor', 'Daawat', 'Catch', 'Red Label', 'Taj Mahal', 'Lipton', 'Bru', 'Nescafe', 'Gillette', 'Whisper', 'Stayfree', 'Vim', 'Pril', 'Domex', 'Harpic', 'Colin', 'Godrej', 'Savlon', 'Cinthol', 'Parachute', 'Vatika', 'Bajaj', 'Navratna', 'Eno', 'Hajmola', 'Sensodyne', 'Glow & Lovely', 'Ponds', 'Lakme', 'Mamaearth'];

const productTypes = [
  { name: 'Milk', category: 'Dairy & Bakery', variants: ['Toned', 'Full Cream', 'Cow'], sizes: ['500ml', '1L'], basePrice: 35, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80' },
  { name: 'Bread', category: 'Dairy & Bakery', variants: ['White', 'Brown', 'Multigrain'], sizes: ['400g'], basePrice: 40, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80' },
  { name: 'Butter', category: 'Dairy & Bakery', variants: ['Salted', 'Unsalted', 'Garlic'], sizes: ['100g', '500g'], basePrice: 55, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=200&q=80' },
  { name: 'Cheese', category: 'Dairy & Bakery', variants: ['Cubes', 'Slices', 'Block'], sizes: ['200g'], basePrice: 125, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&q=80' },
  { name: 'Biscuits', category: 'Snacks & Branded Foods', variants: ['Marie', 'Chocolate', 'Butter', 'Oats'], sizes: ['100g', '250g'], basePrice: 25, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&q=80' },
  { name: 'Namkeen', category: 'Snacks & Branded Foods', variants: ['Bhujia', 'Mixture', 'Moong Dal', 'Aloo Bhujia'], sizes: ['200g', '400g'], basePrice: 60, image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=200&q=80' },
  { name: 'Chips', category: 'Snacks & Branded Foods', variants: ['Salted', 'Masala', 'Tomato', 'Cream & Onion'], sizes: ['50g', '150g'], basePrice: 20, image: 'https://images.unsplash.com/photo-1566478989037-e924e526c483?w=200&q=80' },
  { name: 'Noodles', category: 'Instant Food', variants: ['Masala', 'Chicken', 'Oats', 'Atta'], sizes: ['70g', '280g'], basePrice: 14, image: 'https://images.unsplash.com/photo-1612929633738-8fe01f7467c1?w=200&q=80' },
  { name: 'Pasta', category: 'Instant Food', variants: ['Macaroni', 'Penne', 'Fusilli'], sizes: ['400g'], basePrice: 65, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=200&q=80' },
  { name: 'Ketchup', category: 'Staples', variants: ['Tomato', 'Chilli', 'Sweet & Sour'], sizes: ['500g', '1kg'], basePrice: 95, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=200&q=80' },
  { name: 'Jam', category: 'Staples', variants: ['Mixed Fruit', 'Mango', 'Pineapple'], sizes: ['500g'], basePrice: 160, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=200&q=80' },
  { name: 'Atta', category: 'Staples', variants: ['Whole Wheat', 'Multigrain', 'Select'], sizes: ['1kg', '5kg', '10kg'], basePrice: 55, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80' },
  { name: 'Rice', category: 'Staples', variants: ['Basmati', 'Sona Masoori', 'Brown'], sizes: ['1kg', '5kg'], basePrice: 85, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80' },
  { name: 'Dal', category: 'Staples', variants: ['Toor', 'Moong', 'Chana', 'Urad', 'Masoor'], sizes: ['500g', '1kg'], basePrice: 130, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80' },
  { name: 'Oil', category: 'Staples', variants: ['Mustard', 'Sunflower', 'Groundnut', 'Olive'], sizes: ['1L', '5L'], basePrice: 160, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80' },
  { name: 'Spices', category: 'Staples', variants: ['Turmeric', 'Red Chilli', 'Coriander', 'Garam Masala'], sizes: ['100g', '200g'], basePrice: 45, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80' },
  { name: 'Salt', category: 'Staples', variants: ['Iodized', 'Rock', 'Black'], sizes: ['1kg'], basePrice: 24, image: 'https://images.unsplash.com/photo-1626200419109-383842838df2?w=200&q=80' },
  { name: 'Sugar', category: 'Staples', variants: ['Refined', 'Brown', 'Cubes'], sizes: ['1kg', '5kg'], basePrice: 48, image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=200&q=80' },
  { name: 'Tea', category: 'Beverages', variants: ['Black', 'Green', 'Masala', 'Ginger'], sizes: ['250g', '500g'], basePrice: 145, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80' },
  { name: 'Coffee', category: 'Beverages', variants: ['Instant', 'Filter', 'Gold'], sizes: ['50g', '100g'], basePrice: 95, image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=200&q=80' },
  { name: 'Juice', category: 'Beverages', variants: ['Mango', 'Apple', 'Mixed Fruit', 'Orange'], sizes: ['200ml', '1L'], basePrice: 22, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&q=80' },
  { name: 'Cold Drink', category: 'Beverages', variants: ['Cola', 'Orange', 'Lemon', 'Clear'], sizes: ['250ml', '750ml', '2L'], basePrice: 40, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80' },
  { name: 'Water', category: 'Beverages', variants: ['Mineral', 'Sparkling'], sizes: ['1L', '2L'], basePrice: 20, image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=200&q=80' },
  { name: 'Health Drink', category: 'Beverages', variants: ['Chocolate', 'Vanilla', 'Classic'], sizes: ['500g', '1kg'], basePrice: 210, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=200&q=80' },
  { name: 'Soap', category: 'Personal Care', variants: ['Aloe Vera', 'Neem', 'Sandalwood', 'Lemon'], sizes: ['75g', '125g'], basePrice: 38, image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=200&q=80' },
  { name: 'Shampoo', category: 'Personal Care', variants: ['Anti-Dandruff', 'Hair Fall', 'Smooth', 'Herbal'], sizes: ['180ml', '340ml', '650ml'], basePrice: 160, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&q=80' },
  { name: 'Toothpaste', category: 'Personal Care', variants: ['Strong Teeth', 'Fresh', 'Herbal', 'Sensitive'], sizes: ['100g', '200g'], basePrice: 58, image: 'https://images.unsplash.com/photo-1559304787-54585f56bfa8?w=200&q=80' },
  { name: 'Deodorant', category: 'Personal Care', variants: ['Cool', 'Musk', 'Fresh', 'Sport'], sizes: ['150ml'], basePrice: 210, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&q=80' },
  { name: 'Face Wash', category: 'Personal Care', variants: ['Neem', 'Lemon', 'Charcoal', 'Papaya'], sizes: ['50g', '100g'], basePrice: 85, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80' },
  { name: 'Hair Oil', category: 'Personal Care', variants: ['Coconut', 'Almond', 'Amla', 'Bhringraj'], sizes: ['100ml', '250ml'], basePrice: 45, image: 'https://images.unsplash.com/photo-1608248593842-83b6329cbfcc?w=200&q=80' },
  { name: 'Detergent Powder', category: 'Cleaning & Household', variants: ['Regular', 'Matic Top Load', 'Matic Front Load'], sizes: ['500g', '1kg', '3kg'], basePrice: 65, image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=200&q=80' },
  { name: 'Dishwash Bar', category: 'Cleaning & Household', variants: ['Lemon', 'Neem'], sizes: ['125g', '250g'], basePrice: 12, image: 'https://images.unsplash.com/photo-1584820927498-cafe3c157921?w=200&q=80' },
  { name: 'Floor Cleaner', category: 'Cleaning & Household', variants: ['Pine', 'Citrus', 'Floral', 'Jasmine'], sizes: ['500ml', '1L'], basePrice: 95, image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&q=80' },
  { name: 'Toilet Cleaner', category: 'Cleaning & Household', variants: ['Original', 'Rose', 'Lemon'], sizes: ['500ml', '1L'], basePrice: 88, image: 'https://images.unsplash.com/photo-1584820927498-cafe3c157921?w=200&q=80' },
  { name: 'Diapers', category: 'Baby Care', variants: ['Small', 'Medium', 'Large', 'XL'], sizes: ['30 Pcs', '60 Pcs'], basePrice: 410, image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=200&q=80' },
  { name: 'Baby Wipes', category: 'Baby Care', variants: ['Aloe Vera', 'Water', 'Powder Scent'], sizes: ['72 Wipes'], basePrice: 160, image: 'https://images.unsplash.com/photo-1584820927498-cafe3c157921?w=200&q=80' }
];

const generateProducts = () => {
  const products = [];
  const generatedNames = new Set();
  
  // Create test barcodes specifically mapped to 2 products
  products.push({
    barcode: "123456789",
    name: "Aashirvaad Whole Wheat Atta - 5kg",
    price: 245,
    mrp: 270,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80',
    category: "Staples",
    stock: 50,
    storeId: "Store_Mumbai_01"
  });
  
  products.push({
    barcode: "987654321",
    name: "Amul Taaza Toned Milk - 1L",
    price: 68,
    mrp: 70,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80',
    category: "Dairy & Bakery",
    stock: 120,
    storeId: "Store_Mumbai_01"
  });

  let barcodeCounter = 8901000000000; // Standard EAN-13 for India
  
  while (products.length < 1000) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const type = productTypes[Math.floor(Math.random() * productTypes.length)];
    const variant = type.variants[Math.floor(Math.random() * type.variants.length)];
    const size = type.sizes[Math.floor(Math.random() * type.sizes.length)];
    
    const name = `${brand} ${type.name} ${variant} - ${size}`;
    
    // Skip exact duplicates to make the catalog look premium and varied
    if (generatedNames.has(name)) continue;
    generatedNames.add(name);
    
    let priceMultiplier = 1;
    if (size.includes('kg') || size.includes('L') || size.includes('Pcs')) {
      priceMultiplier = parseFloat(size) || 1;
    } else if (size.includes('g') || size.includes('ml')) {
      priceMultiplier = (parseFloat(size) || 100) / 500;
    }
    
    let rawPrice = type.basePrice * priceMultiplier * (0.8 + Math.random() * 0.4);
    let finalPrice = Math.max(5, Math.round(rawPrice / 5) * 5); // Round to nearest 5 rupees
    let mrp = finalPrice + (Math.floor(Math.random() * 4 + 1) * 5); // MRP is 5-20 Rs higher

    // Generate highly reliable tags focused on the main category and item
    const mainTag = type.name.split(' ')[0].toLowerCase();
    const dynamicImage = `https://loremflickr.com/400/400/grocery,${mainTag}?lock=${products.length}`;

    products.push({
      barcode: (barcodeCounter++).toString(),
      name: name,
      price: finalPrice,
      mrp: mrp,
      image: dynamicImage,
      category: type.category,
      stock: Math.floor(Math.random() * 80) + 5,
      storeId: "Store_Mumbai_01"
    });
  }

  return products;
};

const run = async () => {
  try {
    const newProducts = generateProducts();
    console.log(`Generated ${newProducts.length} highly contextual Indian grocery products.`);
    
    await Product.deleteMany({});
    console.log('Cleared old products from database.');
    
    await Product.insertMany(newProducts);
    console.log('Successfully inserted exactly 1000 authentic products!');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

run();
