const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const ProductSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 },
  storeId: { type: String, default: "Store_Jaipur_01" }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Category specific beautiful high-resolution Unsplash images
const unsplashPool = {
  "Produce": [
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80", // Tomato
    "https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?w=400&q=80", // Banana
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80", // Potato
    "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=400&q=80", // Onion
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80", // Capsicum
    "https://images.unsplash.com/photo-1568584711291-7485e201f89a?w=400&q=80", // Cauliflower
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80", // Carrot
    "https://images.unsplash.com/photo-1587570220670-652f75470d06?w=400&q=80", // Peas
    "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&q=80", // Lemon
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=400&q=80", // Apple
    "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&q=80", // Orange
    "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=80"  // Mango
  ],
  "Dairy & Bakery": [
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80", // Butter
    "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80", // Milk
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80", // Cheese
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80", // Bread
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80", // Paneer
    "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80", // Yogurt
    "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80"  // Cake
  ],
  "Snacks & Munchies": [
    "https://images.unsplash.com/photo-1566478989037-e924e526c483?w=400&q=80", // Chips
    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80", // Namkeen
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80", // Biscuits
    "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80", // Chocolates
    "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80"  // Popcorn
  ],
  "Instant Foods": [
    "https://images.unsplash.com/photo-1612929633738-8fe01f7467c1?w=400&q=80", // Noodles
    "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&q=80", // Ketchup
    "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&q=80", // Jam
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"  // Ready meals
  ],
  "Beverages": [
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80", // Cola
    "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&q=80", // Coffee
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80", // Tea
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80", // Juice
    "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&q=80"  // Water
  ],
  "Staples": [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80", // Atta
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", // Rice
    "https://images.unsplash.com/photo-1626200419109-383842838df2?w=400&q=80", // Salt
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80", // Oil
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80", // Dals
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"  // Spices
  ],
  "Household & Care": [
    "https://images.unsplash.com/photo-1584820927498-cafe8c105b0e?w=400&q=80", // Handwash & Cleaners
    "https://images.unsplash.com/photo-1559591937-beaaeab02371?w=400&q=80", // Toothpaste
    "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&q=80", // Soap
    "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80", // Dishwash gel
    "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=400&q=80", // Detergent
    "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80"  // Shampoo
  ],
  "Meat & Seafood": [
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80", // Chicken
    "https://images.unsplash.com/photo-1588169932014-9842a2228bb3?w=400&q=80", // Mutton
    "https://images.unsplash.com/photo-1506976785307-8732e854ad02?w=400&q=80", // Eggs
    "https://images.unsplash.com/photo-1562967914-01efa7e87832?w=400&q=80"  // Nuggets
  ]
};

const handcraftedProducts = [
  // 1. Produce (Fresh Fruits & Vegetables) - 15 items
  {
    barcode: "8901000000014",
    name: "Fresh Local Tomato (टमाटर) - 1kg",
    price: 35, mrp: 45,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80",
    category: "Produce", stock: 45
  },
  {
    barcode: "8901000000021",
    name: "Premium Banana (केला) - 1 Dozen",
    price: 55, mrp: 70,
    image: "https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?w=400&q=80",
    category: "Produce", stock: 30
  },
  {
    barcode: "8901000000038",
    name: "Fresh Potato (आलू) Jyoti - 1kg",
    price: 28, mrp: 35,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80",
    category: "Produce", stock: 80
  },
  {
    barcode: "8901000000045",
    name: "Red Onion (प्याज़) - 1kg",
    price: 40, mrp: 50,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=400&q=80",
    category: "Produce", stock: 65
  },
  {
    barcode: "8901000000052",
    name: "Fresh Green Capsicum (शिमला मिर्च) - 500g",
    price: 30, mrp: 40,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80",
    category: "Produce", stock: 25
  },
  {
    barcode: "8901000000069",
    name: "Fresh Cauliflower (फूलगोभी) - 1 Pc",
    price: 35, mrp: 45,
    image: "https://images.unsplash.com/photo-1568584711291-7485e201f89a?w=400&q=80",
    category: "Produce", stock: 20
  },
  {
    barcode: "8901000000076",
    name: "Premium Carrot (गाजर) - 500g",
    price: 25, mrp: 35,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
    category: "Produce", stock: 40
  },
  {
    barcode: "8901000000083",
    name: "Green Peas (हरी मटर) - 500g",
    price: 45, mrp: 55,
    image: "https://images.unsplash.com/photo-1587570220670-652f75470d06?w=400&q=80",
    category: "Produce", stock: 30
  },
  {
    barcode: "8901000000090",
    name: "Fresh Lemon (नींबू) - 250g",
    price: 20, mrp: 25,
    image: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&q=80",
    category: "Produce", stock: 50
  },
  {
    barcode: "8901000000106",
    name: "Sweet Apple Royal (सेब) - 1kg",
    price: 160, mrp: 200,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=400&q=80",
    category: "Produce", stock: 40
  },
  {
    barcode: "8901000000113",
    name: "Fresh Garlic (लहसुन) - 200g",
    price: 45, mrp: 55,
    image: "https://images.unsplash.com/photo-1540148426945-1473330af22c?w=400&q=80",
    category: "Produce", stock: 45
  },
  {
    barcode: "8901000000120",
    name: "Fresh Ginger (अदरक) - 250g",
    price: 35, mrp: 45,
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=80",
    category: "Produce", stock: 35
  },
  {
    barcode: "8901000000137",
    name: "Fresh Coriander Leaves (धनिया) - 1 Bunch",
    price: 10, mrp: 12,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
    category: "Produce", stock: 100
  },
  {
    barcode: "8901000000144",
    name: "Fresh Palak Spinach (पालक) - 1 Bunch",
    price: 15, mrp: 20,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
    category: "Produce", stock: 60
  },
  {
    barcode: "8901000000151",
    name: "Green Chillies (हरी मिर्च) - 100g",
    price: 12, mrp: 15,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&q=80",
    category: "Produce", stock: 80
  },

  // 2. Dairy & Bakery - 15 items
  {
    barcode: "8901262010015",
    name: "Amul Butter Salted - 100g",
    price: 58, mrp: 60,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",
    category: "Dairy & Bakery", stock: 45
  },
  {
    barcode: "987654321", // Dual compatibility for scanner tests
    name: "Amul Taaza Toned Milk - 1L",
    price: 68, mrp: 70,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
    category: "Dairy & Bakery", stock: 150
  },
  {
    barcode: "8901262020052",
    name: "Amul Cheese Slices (10 Pcs) - 200g",
    price: 140, mrp: 150,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80",
    category: "Dairy & Bakery", stock: 40
  },
  {
    barcode: "8906013320251",
    name: "English Oven Brown Bread - 400g",
    price: 45, mrp: 50,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    category: "Dairy & Bakery", stock: 20
  },
  {
    barcode: "8901262010039",
    name: "Amul Gold Full Cream Milk - 1L",
    price: 74, mrp: 76,
    image: "https://images.unsplash.com/photo-1550583724-1255818c053b?w=400&q=80",
    category: "Dairy & Bakery", stock: 110
  },
  {
    barcode: "8904043900762",
    name: "Mother Dairy Fresh Paneer - 200g",
    price: 85, mrp: 90,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
    category: "Dairy & Bakery", stock: 65
  },
  {
    barcode: "8901262170320",
    name: "Amul Masti Spiced Buttermilk - 200ml",
    price: 15, mrp: 15,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80",
    category: "Dairy & Bakery", stock: 120
  },
  {
    barcode: "8901262040012",
    name: "Mother Dairy Pure Cow Ghee - 1L",
    price: 650, mrp: 720,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",
    category: "Dairy & Bakery", stock: 35
  },
  {
    barcode: "8901262120011",
    name: "Amul Fresh Cream - 250ml",
    price: 67, mrp: 70,
    image: "https://images.unsplash.com/photo-1596450514735-111a2fe02935?w=400&q=80",
    category: "Dairy & Bakery", stock: 45
  },
  {
    barcode: "8901063016216",
    name: "Britannia Fruit Cake - 150g",
    price: 45, mrp: 50,
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80",
    category: "Dairy & Bakery", stock: 25
  },
  {
    barcode: "8906013320145",
    name: "English Oven Burger Buns (4 Pcs)",
    price: 35, mrp: 40,
    image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&q=80",
    category: "Dairy & Bakery", stock: 30
  },
  {
    barcode: "8906013320015",
    name: "Harvest Gold White Bread - 400g",
    price: 32, mrp: 35,
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=80",
    category: "Dairy & Bakery", stock: 40
  },
  {
    barcode: "8901262150025",
    name: "Amul Taaza Milk Tetrapack - 1L",
    price: 72, mrp: 75,
    image: "https://images.unsplash.com/photo-1600335025988-c7e6c38290ba?w=400&q=80",
    category: "Dairy & Bakery", stock: 85
  },
  {
    barcode: "8901058813219",
    name: "Nescafé Intense Milk Coffee Can - 180ml",
    price: 35, mrp: 40,
    image: "https://images.unsplash.com/photo-1517701550927-30cfcb64db10?w=400&q=80",
    category: "Dairy & Bakery", stock: 90
  },
  {
    barcode: "8901262010046",
    name: "Amul Garlic Butter - 100g",
    price: 62, mrp: 65,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",
    category: "Dairy & Bakery", stock: 30
  },

  // 3. Snacks & Munchies - 15 items
  {
    barcode: "8901491101836",
    name: "Lay's Classic Salted Chips - 50g",
    price: 20, mrp: 20,
    image: "https://images.unsplash.com/photo-1566478989037-e924e526c483?w=400&q=80",
    category: "Snacks & Munchies", stock: 90
  },
  {
    barcode: "8901491501049",
    name: "Kurkure Masala Munch - 90g",
    price: 30, mrp: 30,
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
    category: "Snacks & Munchies", stock: 110
  },
  {
    barcode: "8904063200155",
    name: "Haldiram's Aloo Bhujia Sev - 150g",
    price: 55, mrp: 60,
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
    category: "Snacks & Munchies", stock: 75
  },
  {
    barcode: "8901063016209",
    name: "Britannia Bourbon Chocolate Biscuits - 120g",
    price: 25, mrp: 30,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
    category: "Snacks & Munchies", stock: 50
  },
  {
    barcode: "8901063016254",
    name: "Britannia Good Day Butter Biscuits - 150g",
    price: 30, mrp: 35,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
    category: "Snacks & Munchies", stock: 65
  },
  {
    barcode: "8901111245336",
    name: "Parle-G Gold Gluco Biscuits - 200g",
    price: 20, mrp: 20,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
    category: "Snacks & Munchies", stock: 100
  },
  {
    barcode: "8901491102048",
    name: "Lay's American Style Cream & Onion - 50g",
    price: 20, mrp: 20,
    image: "https://images.unsplash.com/photo-1566478989037-e924e526c483?w=400&q=80",
    category: "Snacks & Munchies", stock: 80
  },
  {
    barcode: "8901491501124",
    name: "Kurkure Chilli Chatka - 90g",
    price: 30, mrp: 30,
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
    category: "Snacks & Munchies", stock: 95
  },
  {
    barcode: "8901320348719",
    name: "Cadbury Dairy Milk Silk Chocolate - 60g",
    price: 75, mrp: 80,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80",
    category: "Snacks & Munchies", stock: 45
  },
  {
    barcode: "0401110006571",
    name: "Snickers Peanut Chocolate Bar - 50g",
    price: 45, mrp: 50,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80",
    category: "Snacks & Munchies", stock: 60
  },
  {
    barcode: "8904063200322",
    name: "Haldiram's Bhujia Sev Premium - 150g",
    price: 60, mrp: 65,
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
    category: "Snacks & Munchies", stock: 70
  },
  {
    barcode: "8901362145025",
    name: "Act II Golden Sizzle Butter Popcorn - 90g",
    price: 35, mrp: 40,
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80",
    category: "Snacks & Munchies", stock: 50
  },
  {
    barcode: "8904063200452",
    name: "Haldiram's Moong Dal Salted - 150g",
    price: 55, mrp: 60,
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
    category: "Snacks & Munchies", stock: 65
  },
  {
    barcode: "8901262300125",
    name: "Amul Dark Chocolate - 150g",
    price: 110, mrp: 120,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80",
    category: "Snacks & Munchies", stock: 35
  },
  {
    barcode: "8901058002347",
    name: "Nestle KitKat 4-Finger Chocolate - 38g",
    price: 28, mrp: 30,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80",
    category: "Snacks & Munchies", stock: 120
  },

  // 4. Instant Foods - 15 items
  {
    barcode: "8901058002477",
    name: "Maggi 2-Minute Masala Noodles - 70g",
    price: 14, mrp: 14,
    image: "https://images.unsplash.com/photo-1612929633738-8fe01f7467c1?w=400&q=80",
    category: "Instant Foods", stock: 300
  },
  {
    barcode: "8904043900761",
    name: "MTR Ready to Eat Paneer Butter Masala - 300g",
    price: 110, mrp: 135,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
    category: "Instant Foods", stock: 25
  },
  {
    barcode: "8901058863412",
    name: "Maggi Hot & Sweet Tomato Chilli Sauce - 1kg",
    price: 155, mrp: 180,
    image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&q=80",
    category: "Instant Foods", stock: 45
  },
  {
    barcode: "8904043900325",
    name: "MTR Ready to Eat Palak Paneer - 300g",
    price: 110, mrp: 135,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
    category: "Instant Foods", stock: 30
  },
  {
    barcode: "8901058004525",
    name: "Maggi Cuppa Masala Instant Noodles - 70g",
    price: 45, mrp: 50,
    image: "https://images.unsplash.com/photo-1612929633738-8fe01f7467c1?w=400&q=80",
    category: "Instant Foods", stock: 110
  },
  {
    barcode: "8902511200155",
    name: "Chings Secret Schezwan Chutney - 250g",
    price: 80, mrp: 90,
    image: "https://images.unsplash.com/photo-1606850893325-1e3df9edbb2c?w=400&q=80",
    category: "Instant Foods", stock: 65
  },
  {
    barcode: "8901030653308",
    name: "Kissan Mixed Fruit Jam - 500g",
    price: 150, mrp: 170,
    image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&q=80",
    category: "Instant Foods", stock: 50
  },
  {
    barcode: "8906001022013",
    name: "Yippee Classic Masala Noodles - 70g",
    price: 14, mrp: 14,
    image: "https://images.unsplash.com/photo-1612929633738-8fe01f7467c1?w=400&q=80",
    category: "Instant Foods", stock: 150
  },
  {
    barcode: "8904043900501",
    name: "MTR Ready to Eat Dal Makhani - 300g",
    price: 100, mrp: 120,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    category: "Instant Foods", stock: 40
  },
  {
    barcode: "8901058145231",
    name: "Maggi Masala-Ae-Magic Seasoning (10 Pcs)",
    price: 50, mrp: 50,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    category: "Instant Foods", stock: 80
  },
  {
    barcode: "8902511200322",
    name: "Chings Secret Soy Sauce - 200g",
    price: 55, mrp: 60,
    image: "https://images.unsplash.com/photo-1606850893325-1e3df9edbb2c?w=400&q=80",
    category: "Instant Foods", stock: 70
  },
  {
    barcode: "8902511200452",
    name: "Chings Secret Red Chilli Sauce - 200g",
    price: 55, mrp: 60,
    image: "https://images.unsplash.com/photo-1606850893325-1e3df9edbb2c?w=400&q=80",
    category: "Instant Foods", stock: 65
  },
  {
    barcode: "8902511200582",
    name: "Chings Secret Veg Hakka Noodles - 150g",
    price: 35, mrp: 40,
    image: "https://images.unsplash.com/photo-1612929633738-8fe01f7467c1?w=400&q=80",
    category: "Instant Foods", stock: 90
  },
  {
    barcode: "8901030653452",
    name: "Kissan Sweet Tomato Ketchup - 500g",
    price: 95, mrp: 110,
    image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&q=80",
    category: "Instant Foods", stock: 85
  },
  {
    barcode: "8901030653605",
    name: "Kissan Pineapple Jam - 500g",
    price: 160, mrp: 180,
    image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&q=80",
    category: "Instant Foods", stock: 30
  },

  // 5. Beverages - 15 items
  {
    barcode: "8901764022129",
    name: "Coca-Cola Soft Drink Can - 300ml",
    price: 40, mrp: 40,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    category: "Beverages", stock: 150
  },
  {
    barcode: "8901058813202",
    name: "Nescafe Classic Instant Coffee Jar - 100g",
    price: 290, mrp: 320,
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&q=80",
    category: "Beverages", stock: 45
  },
  {
    barcode: "8901052002572",
    name: "Tata Tea Premium Pack - 250g",
    price: 135, mrp: 150,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80",
    category: "Beverages", stock: 60
  },
  {
    barcode: "8906047051237",
    name: "Paper Boat Aamras Mango Fruit Drink - 250ml",
    price: 35, mrp: 40,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    category: "Beverages", stock: 80
  },
  {
    barcode: "8901764012113",
    name: "Coca-Cola Original Soft Drink - 750ml",
    price: 45, mrp: 45,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    category: "Beverages", stock: 100
  },
  {
    barcode: "8901764032128",
    name: "Sprite Lime Soft Drink Can - 300ml",
    price: 40, mrp: 40,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    category: "Beverages", stock: 80
  },
  {
    barcode: "8901764042127",
    name: "Thums Up Strong Cola Can - 300ml",
    price: 40, mrp: 40,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    category: "Beverages", stock: 120
  },
  {
    barcode: "8901052002121",
    name: "Tetley Green Tea Lemon & Honey (25 Pcs)",
    price: 155, mrp: 180,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80",
    category: "Beverages", stock: 50
  },
  {
    barcode: "8901112224522",
    name: "Real Fruit Power Mixed Fruit Juice - 1L",
    price: 110, mrp: 125,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    category: "Beverages", stock: 75
  },
  {
    barcode: "8901112224607",
    name: "Real Fruit Power Orange Juice - 1L",
    price: 110, mrp: 125,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    category: "Beverages", stock: 65
  },
  {
    barcode: "8901764121013",
    name: "Kinley Mineral Water bottle - 1L",
    price: 20, mrp: 20,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&q=80",
    category: "Beverages", stock: 200
  },
  {
    barcode: "8901111320015",
    name: "Bisleri Mineral Water Bottle - 1L",
    price: 20, mrp: 20,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&q=80",
    category: "Beverages", stock: 300
  },
  {
    barcode: "8901058862145",
    name: "Milo Chocolate Malt Drink - 250g",
    price: 185, mrp: 195,
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&q=80",
    category: "Beverages", stock: 40
  },
  {
    barcode: "8906047051411",
    name: "Paper Boat Jaljeera Spicy Drink - 250ml",
    price: 35, mrp: 40,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    category: "Beverages", stock: 70
  },
  {
    barcode: "8901058813400",
    name: "Bru Instant Gold Coffee Pack - 100g",
    price: 260, mrp: 285,
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&q=80",
    category: "Beverages", stock: 50
  },

  // 6. Staples - 15 items
  {
    barcode: "123456789", // Dual compatibility for standard scan tests
    name: "Aashirvaad Whole Wheat Atta - 5kg",
    price: 245, mrp: 270,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    category: "Staples", stock: 90
  },
  {
    barcode: "8901725181223",
    name: "India Gate Basmati Rice Premium - 1kg",
    price: 110, mrp: 140,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    category: "Staples", stock: 70
  },
  {
    barcode: "8901052005016",
    name: "Tata Salt Iodized - 1kg",
    price: 28, mrp: 28,
    image: "https://images.unsplash.com/photo-1626200419109-383842838df2?w=400&q=80",
    category: "Staples", stock: 200
  },
  {
    barcode: "8906007281087",
    name: "Fortune Kachi Ghani Mustard Oil - 1L",
    price: 165, mrp: 190,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    category: "Staples", stock: 85
  },
  {
    barcode: "8901030653307",
    name: "Kissan Fresh Tomato Ketchup - 1kg",
    price: 120, mrp: 140,
    image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&q=80",
    category: "Staples", stock: 55
  },
  {
    barcode: "8901725181056",
    name: "India Gate Dubar Basmati Rice - 5kg",
    price: 495, mrp: 550,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    category: "Staples", stock: 40
  },
  {
    barcode: "8906007282046",
    name: "Fortune Refined Soyabean Oil - 1L",
    price: 145, mrp: 160,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    category: "Staples", stock: 95
  },
  {
    barcode: "8901052002329",
    name: "Tata Sampann Toor Dal Premium - 1kg",
    price: 175, mrp: 195,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
    category: "Staples", stock: 80
  },
  {
    barcode: "8901052002442",
    name: "Tata Sampann Moong Dal Premium - 1kg",
    price: 160, mrp: 180,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
    category: "Staples", stock: 75
  },
  {
    barcode: "8901052002480",
    name: "Tata Sampann Chana Dal Premium - 1kg",
    price: 110, mrp: 125,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
    category: "Staples", stock: 85
  },
  {
    barcode: "8904004400156",
    name: "Everest Turmeric Powder Pack - 100g",
    price: 32, mrp: 35,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    category: "Staples", stock: 150
  },
  {
    barcode: "8904004400248",
    name: "Everest Tikhalal Chili Powder - 100g",
    price: 45, mrp: 48,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    category: "Staples", stock: 130
  },
  {
    barcode: "8904004400323",
    name: "Everest Garam Masala Powder - 100g",
    price: 78, mrp: 82,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    category: "Staples", stock: 140
  },
  {
    barcode: "8901111245014",
    name: "Madhur Pure Sugar Refined - 1kg",
    price: 52, mrp: 56,
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400&q=80",
    category: "Staples", stock: 180
  },
  {
    barcode: "8901052005085",
    name: "Tata Salt Lite Low Sodium - 1kg",
    price: 42, mrp: 45,
    image: "https://images.unsplash.com/photo-1626200419109-383842838df2?w=400&q=80",
    category: "Staples", stock: 90
  },

  // 7. Household & Care - 15 items
  {
    barcode: "8901396328529",
    name: "Dettol Liquid Handwash Original - 200ml",
    price: 99, mrp: 105,
    image: "https://images.unsplash.com/photo-1584820927498-cafe8c105b0e?w=400&q=80",
    category: "Household & Care", stock: 60
  },
  {
    barcode: "8901123000620",
    name: "Colgate MaxFresh Spicy Gel Toothpaste - 150g",
    price: 95, mrp: 110,
    image: "https://images.unsplash.com/photo-1559591937-beaaeab02371?w=400&q=80",
    category: "Household & Care", stock: 80
  },
  {
    barcode: "8901030753083",
    name: "Dove Cream Beauty Bathing Soap - 75g",
    price: 45, mrp: 48,
    image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&q=80",
    category: "Household & Care", stock: 120
  },
  {
    barcode: "8901030704481",
    name: "Vim Lemon Dishwash Liquid Gel - 250ml",
    price: 55, mrp: 60,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80",
    category: "Household & Care", stock: 100
  },
  {
    barcode: "8901396348121",
    name: "Harpic Disinfectant Toilet Cleaner - 500ml",
    price: 85, mrp: 95,
    image: "https://images.unsplash.com/photo-1584820927498-cafe8c105b0e?w=400&q=80",
    category: "Household & Care", stock: 90
  },
  {
    barcode: "8901030358417",
    name: "Surf Excel Easy Wash Detergent Powder - 1kg",
    price: 140, mrp: 160,
    image: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=400&q=80",
    category: "Household & Care", stock: 75
  },
  {
    barcode: "8901030704122",
    name: "Vim Dishwash Bar Soap - 125g",
    price: 15, mrp: 15,
    image: "https://images.unsplash.com/photo-1584820927498-cafe8c105b0e?w=400&q=80",
    category: "Household & Care", stock: 150
  },
  {
    barcode: "8901396348244",
    name: "Lizol Disinfectant Floor Cleaner Pine - 500ml",
    price: 98, mrp: 110,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80",
    category: "Household & Care", stock: 65
  },
  {
    barcode: "8901030752048",
    name: "Lifebuoy Total 10 Bathing Soap - 125g",
    price: 36, mrp: 40,
    image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&q=80",
    category: "Household & Care", stock: 140
  },
  {
    barcode: "8901123002570",
    name: "Colgate Strong Teeth Toothpaste Pack - 200g",
    price: 110, mrp: 125,
    image: "https://images.unsplash.com/photo-1559591937-beaaeab02371?w=400&q=80",
    category: "Household & Care", stock: 95
  },
  {
    barcode: "8901524314112",
    name: "Comfort After Wash Morning Fresh Fabric Conditioner - 200ml",
    price: 60, mrp: 65,
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80",
    category: "Household & Care", stock: 55
  },
  {
    barcode: "8901030758412",
    name: "Pears Pure & Gentle Bathing Soap - 125g",
    price: 78, mrp: 85,
    image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&q=80",
    category: "Household & Care", stock: 80
  },
  {
    barcode: "8901396349111",
    name: "Dettol Antiseptic Disinfectant Liquid - 500ml",
    price: 215, mrp: 235,
    image: "https://images.unsplash.com/photo-1584820927498-cafe8c105b0e?w=400&q=80",
    category: "Household & Care", stock: 60
  },
  {
    barcode: "8901030623120",
    name: "Clinic Plus Strong & Long Shampoo - 175ml",
    price: 90, mrp: 100,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80",
    category: "Household & Care", stock: 70
  },
  {
    barcode: "8901030359216",
    name: "Surf Excel Easy Wash Detergent Powder - 3kg",
    price: 395, mrp: 450,
    image: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=400&q=80",
    category: "Household & Care", stock: 45
  },

  // 8. Meat & Seafood - 10 items
  {
    barcode: "8901000000168",
    name: "Fresh Chicken Breast (Hormone-Free) - 500g",
    price: 160, mrp: 180,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
    category: "Meat & Seafood", stock: 25
  },
  {
    barcode: "8901000000175",
    name: "Fresh Whole Chicken (With Skin) - 1kg",
    price: 240, mrp: 270,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
    category: "Meat & Seafood", stock: 20
  },
  {
    barcode: "8901000000182",
    name: "Fresh Mutton Keema (Ground Goat Meat) - 500g",
    price: 495, mrp: 550,
    image: "https://images.unsplash.com/photo-1588169932014-9842a2228bb3?w=400&q=80",
    category: "Meat & Seafood", stock: 15
  },
  {
    barcode: "8901000000199",
    name: "Fresh Eggs Large White (Pack of 6)",
    price: 42, mrp: 45,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad02?w=400&q=80",
    category: "Meat & Seafood", stock: 80
  },
  {
    barcode: "8901000000205",
    name: "Fresh Eggs Farm Brown (Pack of 12)",
    price: 110, mrp: 120,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad02?w=400&q=80",
    category: "Meat & Seafood", stock: 50
  },
  {
    barcode: "8901000000212",
    name: "Frozen Chicken Nuggets Party Pack - 500g",
    price: 260, mrp: 300,
    image: "https://images.unsplash.com/photo-1562967914-01efa7e87832?w=400&q=80",
    category: "Meat & Seafood", stock: 40
  },
  {
    barcode: "8901000000229",
    name: "Frozen Chicken Seekh Kebab - 250g",
    price: 175, mrp: 195,
    image: "https://images.unsplash.com/photo-1585325701165-351af916e581?w=400&q=80",
    category: "Meat & Seafood", stock: 35
  },
  {
    barcode: "8901000000236",
    name: "Frozen Fish Fingers Premium Pack - 250g",
    price: 220, mrp: 250,
    image: "https://images.unsplash.com/photo-1559742811-822873691df8?w=400&q=80",
    category: "Meat & Seafood", stock: 30
  },
  {
    barcode: "8901000000243",
    name: "Fresh Mutton Curry Cut (Goat Meat) - 500g",
    price: 450, mrp: 480,
    image: "https://images.unsplash.com/photo-1588169932014-9842a2228bb3?w=400&q=80",
    category: "Meat & Seafood", stock: 18
  },
  {
    barcode: "8901000000250",
    name: "Fresh Boneless Chicken Cubes - 500g",
    price: 195, mrp: 220,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
    category: "Meat & Seafood", stock: 25
  }
];

const extraBrands = {
  "Produce": ["Organic", "Zespri", "FreshPik", "Safal", "Grown Local"],
  "Dairy & Bakery": ["Amul", "Mother Dairy", "Britannia", "Gowardhan", "Kwality Wall's", "Baskin Robbins", "English Oven", "Harvest Gold"],
  "Snacks & Munchies": ["Lay's", "Kurkure", "Haldiram's", "Bingo!", "Uncle Chipps", "Cadbury", "Nestle", "Parle-G", "Britannia", "Balaji"],
  "Instant Foods": ["Maggi", "MTR", "Ching's Secret", "Knorr", "Yippee!", "Bambino", "Kissan"],
  "Beverages": ["Coca-Cola", "Pepsi", "Sprite", "Thums Up", "Limca", "Fanta", "Paper Boat", "Real", "Tropicana", "Tata Tea", "Red Label", "Taj Mahal", "Nescafe", "Bru", "Bisleri", "Kinley", "Aquafina"],
  "Staples": ["Aashirvaad", "India Gate", "Tata Sampann", "Fortune", "Saffola", "Dhara", "Everest", "Catch", "MDH", "Madhur", "Rajdhani"],
  "Household & Care": ["Dettol", "Colgate", "Pepsodent", "Sensodyne", "Dove", "Lifebuoy", "Pears", "Vim", "Pril", "Surf Excel", "Ariel", "Tide", "Lizol", "Harpic", "Clinic Plus", "Sunsilk", "Head & Shoulders"],
  "Meat & Seafood": ["Zorabian", "Venky's", "Suguna", "Licious", "FarmMade"]
};

const extraTypes = {
  "Produce": [
    { name: "Green Apple (हरा सेब)", basePrice: 180, variants: ["Imported", "Premium"], sizes: ["1kg", "500g"] },
    { name: "Pomegranate (अनार)", basePrice: 140, variants: ["Kabul", "Local"], sizes: ["1kg", "500g"] },
    { name: "Sweet Malta Orange (संतरा)", basePrice: 90, variants: ["Nagpur", "Imported"], sizes: ["1kg", "500g"] },
    { name: "Fresh Broccoli (ब्रोकोली)", basePrice: 80, variants: ["Exotic", "Hydroponic"], sizes: ["1 Pc", "500g"] },
    { name: "Fresh Mushroom (मशरूम)", basePrice: 45, variants: ["Button", "Oyster"], sizes: ["200g"] },
    { name: "Sweet Corn (मक्का)", basePrice: 25, variants: ["American Sweet", "Local"], sizes: ["1 Pc", "2 Pcs"] }
  ],
  "Dairy & Bakery": [
    { name: "Greek Yogurt (दही)", basePrice: 60, variants: ["Mango", "Strawberry", "Blueberry", "Plain"], sizes: ["150g", "200g"] },
    { name: "Flavoured Milk Bottle", basePrice: 35, variants: ["Kesar Pista", "Chocolate", "Butterscotch", "Strawberry"], sizes: ["180ml", "200ml"] },
    { name: "Cheese Cubes Pack", basePrice: 130, variants: ["Processed", "Cheddar"], sizes: ["200g"] },
    { name: "Paneer Block", basePrice: 90, variants: ["Malai", "Low Fat"], sizes: ["200g", "400g"] },
    { name: "Chocolate Chip Cookies", basePrice: 40, variants: ["Premium", "Double Chocolate"], sizes: ["150g", "250g"] },
    { name: "Cream Cheese Spread", basePrice: 160, variants: ["Garlic & Herbs", "Plain"], sizes: ["150g"] }
  ],
  "Snacks & Munchies": [
    { name: "Potato Chips", basePrice: 20, variants: ["Spanish Tomato", "Hot & Sweet", "Classic Salted"], sizes: ["50g", "100g"] },
    { name: "Premium Cashew Nuts (काजू)", basePrice: 220, variants: ["Salted", "Roasted", "Plain"], sizes: ["100g", "200g"] },
    { name: "Premium Almonds (बादाम)", basePrice: 190, variants: ["California", "Raw"], sizes: ["100g", "200g"] },
    { name: "Fruit & Nut Chocolate Bar", basePrice: 80, variants: ["Silk", "Dark"], sizes: ["55g", "80g"] },
    { name: "Diet Chivda Snack", basePrice: 45, variants: ["Roasted", "Low Fat"], sizes: ["150g", "250g"] },
    { name: "Wafer Biscuits", basePrice: 30, variants: ["Chocolate", "Vanilla", "Strawberry"], sizes: ["75g", "150g"] }
  ],
  "Instant Foods": [
    { name: "Instant Cup Pasta", basePrice: 45, variants: ["Tomato Twist", "Cheesy Tomato", "Cheese Macaroni"], sizes: ["65g"] },
    { name: "Veg Hakka Noodles Pack", basePrice: 40, variants: ["Whole Wheat", "Regular"], sizes: ["150g", "300g"] },
    { name: "Sweet & Sour Tomato Soup", basePrice: 15, variants: ["Healthy", "Thick"], sizes: ["20g", "50g"] },
    { name: "Ready-to-Eat Dal Tadka", basePrice: 95, variants: ["Dhaba Style", "Home Style"], sizes: ["280g"] },
    { name: "Green Chilli Pickle (अचार)", basePrice: 70, variants: ["Spicy", "Homemade"], sizes: ["250g", "500g"] }
  ],
  "Beverages": [
    { name: "Fruit Juice Premium", basePrice: 115, variants: ["Pomegranate", "Guava", "Litchi", "Cranberry"], sizes: ["1L", "250ml"] },
    { name: "Diet Cola Zero Sugar", basePrice: 40, variants: ["Slim Can", "Bottle"], sizes: ["300ml", "600ml"] },
    { name: "Premium Green Tea Bag", basePrice: 160, variants: ["Classic Green", "Tulsi & Jasmine", "Mint"], sizes: ["25 Pcs", "50 Pcs"] },
    { name: "Filter Coffee Pack", basePrice: 120, variants: ["Strong Chicory", "Pure Coffee"], sizes: ["200g", "500g"] },
    { name: "Tonic Water", basePrice: 65, variants: ["Ginger Ale", "Club Soda"], sizes: ["300ml"] }
  ],
  "Staples": [
    { name: "Premium Basmati Rice", basePrice: 120, variants: ["Rozana", "Super", "Tibhar"], sizes: ["1kg", "5kg"] },
    { name: "Kachi Ghani Mustard Oil", basePrice: 170, variants: ["Pure Cold Pressed", "Regular"], sizes: ["1L", "5L"] },
    { name: "Toor Dal (Arhar)", basePrice: 165, variants: ["Premium", "Unpolished"], sizes: ["1kg", "500g"] },
    { name: "Moong Dal Chilka", basePrice: 150, variants: ["Premium", "Organic"], sizes: ["1kg", "500g"] },
    { name: "Kabuli Chana (White Chickpeas)", basePrice: 130, variants: ["Big Bold", "Regular"], sizes: ["1kg", "500g"] },
    { name: "Kashmiri Mirch Powder", basePrice: 65, variants: ["Mild Spicy", "Colour Pack"], sizes: ["100g", "200g"] }
  ],
  "Household & Care": [
    { name: "Disinfectant Toilet Cleaner", basePrice: 90, variants: ["Rose", "Citrus", "Original Blue"], sizes: ["500ml", "1L"] },
    { name: "All-Purpose Glass Cleaner", basePrice: 85, variants: ["Lemon", "Original Blue"], sizes: ["500ml"] },
    { name: "Anti-Dandruff Shampoo", basePrice: 175, variants: ["Cool Menthol", "Lemon Fresh", "Smooth & Silky"], sizes: ["180ml", "360ml"] },
    { name: "Bathing Soap Bar", basePrice: 40, variants: ["Neem & Aloe", "Sandalwood", "Rose Water"], sizes: ["100g", "125g"] },
    { name: "Active Gel Dishwash Liquid", basePrice: 60, variants: ["Lemon Gel", "Anti-Smell Lime"], sizes: ["250ml", "500ml"] }
  ],
  "Meat & Seafood": [
    { name: "Frozen Chicken Nuggets", basePrice: 145, variants: ["Classic Crunchy", "Spicy Pepper"], sizes: ["250g", "500g"] },
    { name: "Fresh Egg Box", basePrice: 42, variants: ["White Table Eggs", "Brown Organic Eggs"], sizes: ["6 Pcs", "12 Pcs"] },
    { name: "Chicken Seekh Kebab", basePrice: 180, variants: ["Tandoori", "Malai Cream"], sizes: ["250g"] }
  ]
};

const generateTo500 = () => {
  const products = [...handcraftedProducts];
  const generatedNames = new Set(products.map(p => p.name.toLowerCase()));
  let barcodeCounter = 8904000000100;

  const categories = Object.keys(extraTypes);

  while (products.length < 500) {
    // Select random category
    const cat = categories[Math.floor(Math.random() * categories.length)];
    
    // Select random brand
    const brandList = extraBrands[cat];
    const brand = brandList[Math.floor(Math.random() * brandList.length)];
    
    // Select random type
    const typeList = extraTypes[cat];
    const type = typeList[Math.floor(Math.random() * typeList.length)];
    
    // Select random variant and size
    const variant = type.variants[Math.floor(Math.random() * type.variants.length)];
    const size = type.sizes[Math.floor(Math.random() * type.sizes.length)];

    const name = `${brand} ${type.name} (${variant}) - ${size}`;

    // Skip duplicates
    if (generatedNames.has(name.toLowerCase())) continue;
    generatedNames.add(name.toLowerCase());

    // Calculate realistic price
    let sizeMultiplier = 1;
    if (size.includes("kg") || size.includes("L") || size.includes("Pcs")) {
      sizeMultiplier = parseFloat(size) || 1;
    } else if (size.includes("g") || size.includes("ml")) {
      sizeMultiplier = (parseFloat(size) || 100) / 400;
    }
    
    let base = type.basePrice * sizeMultiplier;
    let finalPrice = Math.max(10, Math.round((base * (0.85 + Math.random() * 0.3)) / 5) * 5); // Rounded to nearest 5 Rs
    let mrp = Math.round((finalPrice * (1.1 + Math.random() * 0.15)) / 5) * 5; // MRP 10-25% higher

    // Category-specific Unsplash Image
    const images = unsplashPool[cat];
    const image = images[products.length % images.length];

    products.push({
      barcode: (barcodeCounter++).toString(),
      name: name,
      price: finalPrice,
      mrp: mrp,
      image: image,
      category: cat,
      stock: Math.floor(Math.random() * 70) + 15
    });
  }

  return products;
};

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing in your .env configuration file.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas Cluster...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database successfully.');

    // Clear old products
    await Product.deleteMany({});
    console.log('Cleared old products catalog.');

    // Generate 500 highly realistic Indian products
    console.log('Generating 500 premium retail items...');
    const fullCatalog = generateTo500();

    // Seed new catalog
    const seeded = await Product.insertMany(fullCatalog.map(p => ({
      ...p,
      storeId: "Store_Jaipur_01" // Standardized store ID for the JECRC university spec
    })));
    console.log(`Successfully seeded exactly ${seeded.length} real, distinct Indian products with premium category-specific Unsplash images!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed:', error);
    process.exit(1);
  }
}

seed();
