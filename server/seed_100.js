const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

const categories = [
  'Produce', 'Bakery', 'Dairy & Eggs', 'Beverages', 'Snacks', 
  'Meat & Seafood', 'Pantry', 'Frozen', 'Household', 'Personal Care'
];

const items = {
  'Produce': [
    { name: 'Organic Bananas', price: 2.99, image: 'https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?w=400&q=80' },
    { name: 'Fresh Strawberries', price: 4.50, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80' },
    { name: 'Avocado', price: 1.99, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80' },
    { name: 'Honeycrisp Apples', price: 3.49, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=400&q=80' },
    { name: 'Seedless Watermelon', price: 5.99, image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&q=80' },
    { name: 'Organic Baby Spinach', price: 3.99, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80' },
    { name: 'Roma Tomatoes', price: 2.49, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80' },
    { name: 'Red Bell Pepper', price: 1.49, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80' },
    { name: 'Carrots', price: 1.29, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80' },
    { name: 'Broccoli Crown', price: 2.19, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80' },
    { name: 'Yellow Onions', price: 1.99, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80' },
    { name: 'Garlic', price: 0.99, image: 'https://images.unsplash.com/photo-1540148426945-1473330af22c?w=400&q=80' }
  ],
  'Bakery': [
    { name: 'Sourdough Bread', price: 4.99, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&q=80' },
    { name: 'Croissants (4-pack)', price: 5.49, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
    { name: 'Baguette', price: 2.99, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=80' },
    { name: 'Chocolate Chip Cookies', price: 3.99, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80' },
    { name: 'Blueberry Muffins', price: 4.49, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80' },
    { name: 'Whole Wheat Bread', price: 3.49, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
    { name: 'Cinnamon Rolls', price: 5.99, image: 'https://images.unsplash.com/photo-1509365465994-3e8f8150ecfb?w=400&q=80' },
    { name: 'Plain Bagels', price: 3.99, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&q=80' },
    { name: 'Apple Pie', price: 8.99, image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&q=80' }
  ],
  'Dairy & Eggs': [
    { name: 'Whole Milk (1 Gal)', price: 3.89, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80' },
    { name: 'Almond Milk', price: 3.99, image: 'https://images.unsplash.com/photo-1550583724-1255818c053b?w=400&q=80' },
    { name: 'Large Brown Eggs', price: 4.29, image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad02?w=400&q=80' },
    { name: 'Cheddar Cheese', price: 4.99, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1fce?w=400&q=80' },
    { name: 'Greek Yogurt', price: 5.49, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
    { name: 'Salted Butter', price: 4.49, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80' },
    { name: 'Mozzarella Sticks', price: 3.99, image: 'https://images.unsplash.com/photo-1531685250784-473a5e4c0228?w=400&q=80' },
    { name: 'Oat Milk', price: 4.49, image: 'https://images.unsplash.com/photo-1600335025988-c7e6c38290ba?w=400&q=80' },
    { name: 'Cream Cheese', price: 2.99, image: 'https://images.unsplash.com/photo-1596450514735-111a2fe02935?w=400&q=80' },
    { name: 'Sour Cream', price: 2.49, image: 'https://images.unsplash.com/photo-1584285493019-b541bbbb6a3d?w=400&q=80' }
  ],
  'Beverages': [
    { name: 'Cold Brew Coffee', price: 4.99, image: 'https://images.unsplash.com/photo-1517701550927-30cfcb64db10?w=400&q=80' },
    { name: 'Orange Juice', price: 3.99, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b06?w=400&q=80' },
    { name: 'Sparkling Water', price: 5.49, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80' },
    { name: 'Green Tea', price: 2.99, image: 'https://images.unsplash.com/photo-1627492275564-963b65551322?w=400&q=80' },
    { name: 'Cola (12-pack)', price: 6.99, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80' },
    { name: 'Lemonade', price: 2.99, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80' },
    { name: 'Apple Juice', price: 3.49, image: 'https://images.unsplash.com/photo-1601053151817-f58999981881?w=400&q=80' },
    { name: 'Sports Drink', price: 1.99, image: 'https://images.unsplash.com/photo-1521689725807-628f237efdb1?w=400&q=80' },
    { name: 'Coconut Water', price: 3.99, image: 'https://images.unsplash.com/photo-1524156868115-e696b44983db?w=400&q=80' }
  ],
  'Snacks': [
    { name: 'Potato Chips', price: 3.99, image: 'https://images.unsplash.com/photo-1566478989037-e924e5020bf1?w=400&q=80' },
    { name: 'Tortilla Chips', price: 3.49, image: 'https://images.unsplash.com/photo-1613919113640-25732cea5e79?w=400&q=80' },
    { name: 'Dark Chocolate', price: 4.25, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80' },
    { name: 'Mixed Nuts', price: 7.99, image: 'https://images.unsplash.com/photo-1599598425947-330026296906?w=400&q=80' },
    { name: 'Popcorn', price: 2.99, image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80' },
    { name: 'Pretzels', price: 3.49, image: 'https://images.unsplash.com/photo-1601490212076-2e8615b1fb4b?w=400&q=80' },
    { name: 'Granola Bars', price: 4.99, image: 'https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=400&q=80' },
    { name: 'Gummy Bears', price: 2.49, image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&q=80' },
    { name: 'Trail Mix', price: 6.99, image: 'https://images.unsplash.com/photo-1603566235471-ebbbd7e004db?w=400&q=80' },
    { name: 'Rice Cakes', price: 2.99, image: 'https://images.unsplash.com/photo-1563810058348-18e384ed8eb8?w=400&q=80' }
  ],
  'Meat & Seafood': [
    { name: 'Chicken Breast', price: 8.99, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80' },
    { name: 'Ground Beef', price: 6.99, image: 'https://images.unsplash.com/photo-1588169932014-9842a2228bb3?w=400&q=80' },
    { name: 'Salmon Fillet', price: 12.99, image: 'https://images.unsplash.com/photo-1599084920556-9a5725fcdbc9?w=400&q=80' },
    { name: 'Bacon', price: 5.99, image: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&q=80' },
    { name: 'Pork Chops', price: 7.99, image: 'https://images.unsplash.com/photo-1628268909376-e8c56bf73522?w=400&q=80' },
    { name: 'Turkey Breast', price: 9.99, image: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&q=80' },
    { name: 'Shrimp', price: 14.99, image: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=400&q=80' },
    { name: 'Sausage', price: 6.49, image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=400&q=80' },
    { name: 'Hot Dogs', price: 4.49, image: 'https://images.unsplash.com/photo-1593504049359-715c0e1fa625?w=400&q=80' }
  ],
  'Pantry': [
    { name: 'Olive Oil', price: 8.99, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
    { name: 'Pasta', price: 1.99, image: 'https://images.unsplash.com/photo-1551462147-1647eb4bb5f2?w=400&q=80' },
    { name: 'Marinara Sauce', price: 3.49, image: 'https://images.unsplash.com/photo-1606850893325-1e3df9edbb2c?w=400&q=80' },
    { name: 'Peanut Butter', price: 4.99, image: 'https://images.unsplash.com/photo-1584852924151-512140bb06bb?w=400&q=80' },
    { name: 'Jelly', price: 3.99, image: 'https://images.unsplash.com/photo-1591866440788-518fa1c305c4?w=400&q=80' },
    { name: 'Rice', price: 4.49, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
    { name: 'Canned Beans', price: 1.29, image: 'https://images.unsplash.com/photo-1558234382-7ad27c191a3c?w=400&q=80' },
    { name: 'Flour', price: 2.99, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
    { name: 'Sugar', price: 3.49, image: 'https://images.unsplash.com/photo-1581451291122-b2f56b9c9f20?w=400&q=80' },
    { name: 'Cereal', price: 4.99, image: 'https://images.unsplash.com/photo-1521483756775-c3b9dd984ca0?w=400&q=80' },
    { name: 'Honey', price: 6.99, image: 'https://images.unsplash.com/photo-1587049352847-4d4b12756d1c?w=400&q=80' }
  ],
  'Frozen': [
    { name: 'Ice Cream', price: 5.99, image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400&q=80' },
    { name: 'Frozen Pizza', price: 6.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
    { name: 'Frozen Vegetables', price: 2.49, image: 'https://images.unsplash.com/photo-1591855845683-05ab8c239f7f?w=400&q=80' },
    { name: 'Frozen Berries', price: 4.99, image: 'https://images.unsplash.com/photo-1576092040974-9f70cb653194?w=400&q=80' },
    { name: 'Chicken Nuggets', price: 7.49, image: 'https://images.unsplash.com/photo-1562967914-01efa7e87832?w=400&q=80' },
    { name: 'Waffles', price: 3.99, image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80' },
    { name: 'Frozen Meals', price: 4.49, image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&q=80' },
    { name: 'Frozen French Fries', price: 3.49, image: 'https://images.unsplash.com/photo-1576107243916-2c525f0c0576?w=400&q=80' },
    { name: 'Popsicles', price: 4.99, image: 'https://images.unsplash.com/photo-1518063076136-1e62688fdf8f?w=400&q=80' }
  ],
  'Household': [
    { name: 'Paper Towels', price: 9.99, image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&q=80' },
    { name: 'Toilet Paper', price: 10.99, image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&q=80' },
    { name: 'Laundry Detergent', price: 12.99, image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80' },
    { name: 'Dish Soap', price: 3.49, image: 'https://images.unsplash.com/photo-1584820927498-cafe8c105b0e?w=400&q=80' },
    { name: 'Trash Bags', price: 8.99, image: 'https://images.unsplash.com/photo-1600863771536-150cb487f955?w=400&q=80' },
    { name: 'All-Purpose Cleaner', price: 4.49, image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80' },
    { name: 'Sponges', price: 2.99, image: 'https://images.unsplash.com/photo-1585822363191-4475510f279f?w=400&q=80' },
    { name: 'Aluminum Foil', price: 4.99, image: 'https://images.unsplash.com/photo-1589307004071-70e68fb2639a?w=400&q=80' },
    { name: 'Ziploc Bags', price: 5.49, image: 'https://images.unsplash.com/photo-1589307004071-70e68fb2639a?w=400&q=80' }
  ],
  'Personal Care': [
    { name: 'Toothpaste', price: 3.99, image: 'https://images.unsplash.com/photo-1559591937-beaaeab02371?w=400&q=80' },
    { name: 'Shampoo', price: 6.99, image: 'https://images.unsplash.com/photo-1585232351009-aaa01bc1167a?w=400&q=80' },
    { name: 'Body Wash', price: 5.99, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80' },
    { name: 'Deodorant', price: 4.49, image: 'https://images.unsplash.com/photo-1629731915998-333e9b1192e2?w=400&q=80' },
    { name: 'Hand Soap', price: 2.99, image: 'https://images.unsplash.com/photo-1584820927498-cafe8c105b0e?w=400&q=80' },
    { name: 'Lotion', price: 7.49, image: 'https://images.unsplash.com/photo-1556228578-8d89cb7392d4?w=400&q=80' },
    { name: 'Cotton Swabs', price: 2.49, image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&q=80' },
    { name: 'Shaving Cream', price: 3.49, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80' },
    { name: 'Band-Aids', price: 4.99, image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&q=80' },
    { name: 'Vitamins', price: 12.99, image: 'https://images.unsplash.com/photo-1550572017-edb7cb93b131?w=400&q=80' }
  ]
};

async function seed100() {
  try {
    if (!process.env.MONGO_URI) {
      console.log('Error: MONGO_URI missing in .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing products to avoid conflicts
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    const newProducts = [];
    let barcodeCounter = 100000000;

    for (const cat of categories) {
      if (items[cat]) {
        for (const item of items[cat]) {
          // Convert USD to roughly INR and create a discounted MRP
          const inrPrice = Math.ceil(item.price * 82); // Assume 82 INR = 1 USD
          const inrMrp = Math.ceil(inrPrice * 1.35); // Add 35% to make an MRP

          newProducts.push({
            barcode: barcodeCounter.toString(),
            name: item.name,
            price: inrPrice,
            mrp: inrMrp,
            image: item.image,
            category: cat,
            stock: Math.floor(Math.random() * 50) + 10,
            storeId: 'Main Store'
          });
          barcodeCounter++;
        }
      }
    }

    await Product.insertMany(newProducts);
    console.log(`Successfully inserted ${newProducts.length} items with INR prices and MRP!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed100();
