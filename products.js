import fs from "fs";
import { randomUUID } from "crypto";

const stores = [
    "Store_Jaipur_01",
    "Store_Mumbai_01",
    "Store_Delhi_01",
    "Store_Bangalore_01",
    "Store_Pune_01"
];

const categoriesData = [
  {
    category: "Staples",
    brands: [
      {
        name: "Aashirvaad",
        products: [
          { name: "Whole Wheat Atta", variants: [{ size: "1kg", price: 65 }, { size: "5kg", price: 285 }, { size: "10kg", price: 550 }] },
          { name: "Select Sharbati Atta", variants: [{ size: "1kg", price: 75 }, { size: "5kg", price: 340 }] },
          { name: "Multigrain Atta", variants: [{ size: "1kg", price: 80 }, { size: "5kg", price: 350 }] },
          { name: "Salt", variants: [{ size: "1kg", price: 28 }] },
          { name: "Turmeric Powder", variants: [{ size: "100g", price: 35 }, { size: "200g", price: 65 }] }
        ]
      },
      {
        name: "Fortune",
        products: [
          { name: "Basmati Rice", variants: [{ size: "1kg", price: 140 }, { size: "5kg", price: 650 }] },
          { name: "Soya Health Refined Oil", variants: [{ size: "1L", price: 135 }, { size: "5L", price: 650 }] },
          { name: "Kachi Ghani Mustard Oil", variants: [{ size: "1L", price: 165 }] }
        ]
      },
      {
        name: "India Gate",
        products: [
          { name: "Classic Basmati Rice", variants: [{ size: "1kg", price: 220 }, { size: "5kg", price: 1050 }] },
          { name: "Brown Rice", variants: [{ size: "1kg", price: 150 }] }
        ]
      },
      {
        name: "Tata Sampann",
        products: [
          { name: "Unpolished Toor Dal", variants: [{ size: "500g", price: 95 }, { size: "1kg", price: 185 }] },
          { name: "Unpolished Moong Dal", variants: [{ size: "500g", price: 85 }, { size: "1kg", price: 165 }] },
          { name: "Chana Dal", variants: [{ size: "500g", price: 65 }, { size: "1kg", price: 125 }] },
          { name: "Besan", variants: [{ size: "500g", price: 55 }, { size: "1kg", price: 105 }] }
        ]
      },
      {
        name: "Madhur",
        products: [
          { name: "Pure & Hygienic Sugar", variants: [{ size: "1kg", price: 60 }, { size: "5kg", price: 290 }] }
        ]
      }
    ]
  },
  {
    category: "Dairy & Eggs",
    brands: [
      {
        name: "Amul",
        products: [
          { name: "Taaza Toned Milk", variants: [{ size: "500ml", price: 29 }, { size: "1L", price: 56 }] },
          { name: "Gold Full Cream Milk", variants: [{ size: "500ml", price: 34 }, { size: "1L", price: 68 }] },
          { name: "Pasteurised Butter", variants: [{ size: "100g", price: 60 }, { size: "500g", price: 290 }] },
          { name: "Cheese Slices", variants: [{ size: "200g", price: 145 }] },
          { name: "Fresh Paneer", variants: [{ size: "200g", price: 95 }] },
          { name: "Masti Dahi", variants: [{ size: "400g", price: 35 }] }
        ]
      },
      {
        name: "Mother Dairy",
        products: [
          { name: "Full Cream Milk", variants: [{ size: "500ml", price: 34 }, { size: "1L", price: 68 }] },
          { name: "Classic Dahi", variants: [{ size: "400g", price: 35 }] },
          { name: "Mishti Doi", variants: [{ size: "400g", price: 85 }] }
        ]
      },
      {
        name: "Britannia",
        products: [
          { name: "Cheese Cubes", variants: [{ size: "200g", price: 130 }] }
        ]
      },
      {
        name: "Farm Fresh",
        products: [
          { name: "Brown Eggs", variants: [{ size: "Pack of 6", price: 85 }, { size: "Pack of 12", price: 160 }] },
          { name: "White Eggs", variants: [{ size: "Pack of 6", price: 50 }, { size: "Tray of 30", price: 230 }] }
        ]
      }
    ]
  },
  {
    category: "Snacks",
    brands: [
      {
        name: "Lay's",
        products: [
          { name: "India's Magic Masala", variants: [{ size: "50g", price: 20 }, { size: "90g", price: 35 }] },
          { name: "Classic Salted", variants: [{ size: "50g", price: 20 }, { size: "90g", price: 35 }] },
          { name: "American Style Cream & Onion", variants: [{ size: "50g", price: 20 }, { size: "90g", price: 35 }] },
          { name: "Spanish Tomato Tango", variants: [{ size: "50g", price: 20 }] }
        ]
      },
      {
        name: "Kurkure",
        products: [
          { name: "Masala Munch", variants: [{ size: "85g", price: 20 }, { size: "135g", price: 30 }] },
          { name: "Chilli Chatka", variants: [{ size: "85g", price: 20 }] }
        ]
      },
      {
        name: "Parle",
        products: [
          { name: "Parle-G Original", variants: [{ size: "130g", price: 10 }, { size: "800g", price: 65 }] },
          { name: "Hide & Seek", variants: [{ size: "120g", price: 30 }, { size: "200g", price: 50 }] },
          { name: "Monaco Salted", variants: [{ size: "75g", price: 10 }, { size: "200g", price: 25 }] }
        ]
      },
      {
        name: "Britannia",
        products: [
          { name: "Good Day Cashew", variants: [{ size: "100g", price: 20 }, { size: "250g", price: 50 }] },
          { name: "Bourbon", variants: [{ size: "150g", price: 25 }] },
          { name: "Marie Gold", variants: [{ size: "120g", price: 15 }, { size: "250g", price: 35 }] }
        ]
      },
      {
        name: "Haldiram's",
        products: [
          { name: "Aloo Bhujia", variants: [{ size: "200g", price: 60 }, { size: "400g", price: 110 }] },
          { name: "Bhujia Sev", variants: [{ size: "200g", price: 60 }, { size: "400g", price: 110 }] },
          { name: "Moong Dal", variants: [{ size: "200g", price: 55 }] },
          { name: "Khatta Meetha", variants: [{ size: "200g", price: 55 }] }
        ]
      }
    ]
  },
  {
    category: "Instant Food",
    brands: [
      {
        name: "Maggi",
        products: [
          { name: "2-Minute Masala Noodles", variants: [{ size: "70g", price: 14 }, { size: "Pack of 4", price: 56 }, { size: "Pack of 12", price: 168 }] },
          { name: "Oats Noodles", variants: [{ size: "73g", price: 25 }, { size: "Pack of 4", price: 100 }] },
          { name: "Pazzta Masala Penne", variants: [{ size: "65g", price: 28 }] }
        ]
      },
      {
        name: "Yippee",
        products: [
          { name: "Magic Masala Noodles", variants: [{ size: "70g", price: 14 }, { size: "Pack of 4", price: 56 }] }
        ]
      }
    ]
  },
  {
    category: "Beverages",
    brands: [
      {
        name: "Coca-Cola",
        products: [
          { name: "Original Taste Soft Drink", variants: [{ size: "750ml", price: 40 }, { size: "2L", price: 95 }] },
          { name: "Thums Up", variants: [{ size: "750ml", price: 40 }, { size: "2L", price: 95 }] },
          { name: "Sprite", variants: [{ size: "750ml", price: 40 }, { size: "2L", price: 95 }] },
          { name: "Maaza Mango Drink", variants: [{ size: "600ml", price: 45 }, { size: "1.2L", price: 80 }] }
        ]
      },
      {
        name: "PepsiCo",
        products: [
          { name: "Pepsi Black", variants: [{ size: "250ml Can", price: 35 }, { size: "750ml", price: 40 }] },
          { name: "Mountain Dew", variants: [{ size: "750ml", price: 40 }, { size: "2L", price: 95 }] },
          { name: "Slice", variants: [{ size: "600ml", price: 45 }] }
        ]
      },
      {
        name: "Real",
        products: [
          { name: "Mixed Fruit Juice", variants: [{ size: "1L", price: 120 }] },
          { name: "Mango Juice", variants: [{ size: "1L", price: 120 }] }
        ]
      },
      {
        name: "Red Bull",
        products: [
          { name: "Energy Drink", variants: [{ size: "250ml", price: 125 }] },
          { name: "Sugarfree", variants: [{ size: "250ml", price: 125 }] }
        ]
      },
      {
        name: "Tata Tea",
        products: [
          { name: "Premium Tea", variants: [{ size: "250g", price: 145 }, { size: "500g", price: 280 }] },
          { name: "Gold Tea", variants: [{ size: "250g", price: 165 }, { size: "500g", price: 310 }] }
        ]
      },
      {
        name: "Nescafe",
        products: [
          { name: "Classic Coffee", variants: [{ size: "50g", price: 160 }, { size: "100g", price: 310 }] },
          { name: "Gold Blend", variants: [{ size: "50g", price: 480 }] }
        ]
      }
    ]
  },
  {
    category: "Personal Care",
    brands: [
      {
        name: "Dove",
        products: [
          { name: "Cream Beauty Bathing Bar", variants: [{ size: "100g", price: 65 }, { size: "Pack of 3", price: 180 }] },
          { name: "Intense Repair Shampoo", variants: [{ size: "180ml", price: 220 }, { size: "340ml", price: 380 }] },
          { name: "Deeply Nourishing Body Wash", variants: [{ size: "250ml", price: 210 }] }
        ]
      },
      {
        name: "Lifebuoy",
        products: [
          { name: "Total 10 Soap", variants: [{ size: "100g", price: 38 }, { size: "Pack of 4", price: 145 }] },
          { name: "Total 10 Handwash", variants: [{ size: "200ml", price: 99 }, { size: "750ml Refill", price: 199 }] }
        ]
      },
      {
        name: "Dettol",
        products: [
          { name: "Original Soap", variants: [{ size: "75g", price: 45 }, { size: "125g", price: 70 }] },
          { name: "Liquid Handwash", variants: [{ size: "200ml", price: 105 }, { size: "750ml Refill", price: 210 }] },
          { name: "Antiseptic Liquid", variants: [{ size: "250ml", price: 125 }, { size: "500ml", price: 240 }] }
        ]
      },
      {
        name: "Head & Shoulders",
        products: [
          { name: "Smooth & Silky Shampoo", variants: [{ size: "180ml", price: 195 }, { size: "340ml", price: 360 }] },
          { name: "Cool Menthol", variants: [{ size: "180ml", price: 195 }] }
        ]
      },
      {
        name: "Colgate",
        products: [
          { name: "Strong Teeth Toothpaste", variants: [{ size: "100g", price: 60 }, { size: "200g", price: 110 }] },
          { name: "MaxFresh Red Gel", variants: [{ size: "150g", price: 85 }, { size: "300g", price: 160 }] }
        ]
      },
      {
        name: "Nivea",
        products: [
          { name: "Soft Light Moisturizer Cream", variants: [{ size: "50ml", price: 105 }, { size: "100ml", price: 195 }] },
          { name: "Body Lotion Nourishing", variants: [{ size: "200ml", price: 265 }, { size: "400ml", price: 450 }] },
          { name: "Men Fresh Active Deodorant", variants: [{ size: "150ml", price: 210 }] }
        ]
      }
    ]
  },
  {
    category: "Cleaning",
    brands: [
      {
        name: "Surf Excel",
        products: [
          { name: "Easy Wash Detergent Powder", variants: [{ size: "1kg", price: 135 }, { size: "3kg", price: 390 }] },
          { name: "Matic Front Load Liquid", variants: [{ size: "1L", price: 240 }, { size: "2L", price: 460 }] }
        ]
      },
      {
        name: "Ariel",
        products: [
          { name: "Matic Front Load Detergent", variants: [{ size: "1kg", price: 260 }, { size: "2kg", price: 500 }] },
          { name: "Matic Liquid Detergent", variants: [{ size: "1L", price: 250 }] }
        ]
      },
      {
        name: "Vim",
        products: [
          { name: "Dishwash Bar", variants: [{ size: "150g", price: 28 }, { size: "Pack of 3", price: 80 }] },
          { name: "Dishwash Liquid Gel", variants: [{ size: "250ml", price: 120 }, { size: "500ml", price: 220 }] }
        ]
      },
      {
        name: "Harpic",
        products: [
          { name: "Power Plus Toilet Cleaner", variants: [{ size: "500ml", price: 105 }, { size: "1L", price: 195 }] },
          { name: "Bathroom Cleaner", variants: [{ size: "500ml", price: 100 }] }
        ]
      },
      {
        name: "Lizol",
        products: [
          { name: "Disinfectant Floor Cleaner Citrus", variants: [{ size: "500ml", price: 110 }, { size: "1L", price: 205 }] },
          { name: "Floral Floor Cleaner", variants: [{ size: "500ml", price: 110 }] }
        ]
      },
      {
        name: "Comfort",
        products: [
          { name: "After Wash Fabric Conditioner", variants: [{ size: "860ml", price: 235 }, { size: "2L", price: 520 }] }
        ]
      }
    ]
  },
  {
    category: "Vegetables",
    brands: [
      {
        name: "Fresho",
        products: [
          { name: "Fresh Potato", variants: [{ size: "1kg", price: 40 }, { size: "2kg", price: 78 }] },
          { name: "Red Onion", variants: [{ size: "1kg", price: 45 }, { size: "2kg", price: 85 }] },
          { name: "Hybrid Tomato", variants: [{ size: "1kg", price: 50 }, { size: "500g", price: 26 }] },
          { name: "Green Chilli", variants: [{ size: "100g", price: 25 }, { size: "250g", price: 55 }] },
          { name: "Coriander Leaves", variants: [{ size: "100g", price: 15 }] },
          { name: "Fresh Garlic", variants: [{ size: "250g", price: 160 }] },
          { name: "Ginger", variants: [{ size: "250g", price: 85 }] }
        ]
      }
    ]
  },
  {
    category: "Fruits",
    brands: [
      {
        name: "Fresho",
        products: [
          { name: "Farm Fresh Banana", variants: [{ size: "1 Dozen", price: 65 }, { size: "6 Pcs", price: 35 }] },
          { name: "Fuji Apple", variants: [{ size: "1kg", price: 220 }, { size: "500g", price: 115 }] },
          { name: "Nagpur Orange", variants: [{ size: "1kg", price: 130 }] }
        ]
      }
    ]
  }
];

const keywordsToImage = {
  "Atta": "https://m.media-amazon.com/images/I/71M30zVtEjL.jpg",
  "Rice": "https://m.media-amazon.com/images/I/71k-L4VqQ6L.jpg",
  "Dal": "https://m.media-amazon.com/images/I/81xGWeZq3eL.jpg",
  "Besan": "https://m.media-amazon.com/images/I/71oJ3DtdjUL.jpg",
  "Salt": "https://m.media-amazon.com/images/I/61P0QfE82fL.jpg",
  "Sugar": "https://m.media-amazon.com/images/I/71+Fj-5E5LL.jpg",
  "Oil": "https://m.media-amazon.com/images/I/61M9iD4s5oL.jpg",
  "Milk": "https://m.media-amazon.com/images/I/61xhhRM8z3L.jpg",
  "Butter": "https://m.media-amazon.com/images/I/71zVbVl7hAL.jpg",
  "Cheese": "https://m.media-amazon.com/images/I/81Y1mI53VlL.jpg",
  "Paneer": "https://m.media-amazon.com/images/I/51rYqE2JjLL.jpg",
  "Dahi": "https://m.media-amazon.com/images/I/61S2Xq1XGKL.jpg",
  "Doi": "https://m.media-amazon.com/images/I/61S2Xq1XGKL.jpg",
  "Eggs": "https://m.media-amazon.com/images/I/41m91kX2WML.jpg",
  "Chips": "https://m.media-amazon.com/images/I/71V2-FoA6XL.jpg",
  "Kurkure": "https://m.media-amazon.com/images/I/71v13K+O++L.jpg",
  "Parle": "https://m.media-amazon.com/images/I/61KxGv1yB7L.jpg",
  "Good Day": "https://m.media-amazon.com/images/I/71Y+hL2-hSL.jpg",
  "Bourbon": "https://m.media-amazon.com/images/I/71yY3pP13-L.jpg",
  "Marie": "https://m.media-amazon.com/images/I/71zG1YwYq+L.jpg",
  "Noodles": "https://m.media-amazon.com/images/I/81W7b0zJ6kL.jpg",
  "Pazzta": "https://m.media-amazon.com/images/I/81zD2E1fRmL.jpg",
  "Bhujia": "https://m.media-amazon.com/images/I/71B9B1Z-vVL.jpg",
  "Coke": "https://m.media-amazon.com/images/I/61xJkwlr0JL.jpg",
  "Thums Up": "https://m.media-amazon.com/images/I/51X5o2uLhAL.jpg",
  "Sprite": "https://m.media-amazon.com/images/I/61z+FvXhZWL.jpg",
  "Pepsi": "https://m.media-amazon.com/images/I/51WpY+W8JLL.jpg",
  "Dew": "https://m.media-amazon.com/images/I/61+R1gV4aIL.jpg",
  "Slice": "https://m.media-amazon.com/images/I/61aD289B8KL.jpg",
  "Maaza": "https://m.media-amazon.com/images/I/61F+A+wX4YL.jpg",
  "Juice": "https://m.media-amazon.com/images/I/71qP7Ky3OaL.jpg",
  "Red Bull": "https://m.media-amazon.com/images/I/61tOubp1G5L.jpg",
  "Tea": "https://m.media-amazon.com/images/I/71c6q3X-G1L.jpg",
  "Coffee": "https://m.media-amazon.com/images/I/71N1G+h-e5L.jpg",
  "Soap": "https://m.media-amazon.com/images/I/61P7sH4mQhL.jpg",
  "Shampoo": "https://m.media-amazon.com/images/I/61vQC6qYZEL.jpg",
  "Body Wash": "https://m.media-amazon.com/images/I/61lXG8Gj-wL.jpg",
  "Handwash": "https://m.media-amazon.com/images/I/61+9+H6XGkL.jpg",
  "Antiseptic": "https://m.media-amazon.com/images/I/61n-9I8M1bL.jpg",
  "Toothpaste": "https://m.media-amazon.com/images/I/71R8k8q2fPL.jpg",
  "Cream": "https://m.media-amazon.com/images/I/61R-4bJtN-L.jpg",
  "Lotion": "https://m.media-amazon.com/images/I/51BqG6U9T8L.jpg",
  "Deodorant": "https://m.media-amazon.com/images/I/61uA2G0p++L.jpg",
  "Detergent": "https://m.media-amazon.com/images/I/61G+h8R+VML.jpg",
  "Dishwash": "https://m.media-amazon.com/images/I/61nZ8d+G6gL.jpg",
  "Toilet": "https://m.media-amazon.com/images/I/61h6mF8q6RL.jpg",
  "Floor Cleaner": "https://m.media-amazon.com/images/I/61Kx7B1XQML.jpg",
  "Conditioner": "https://m.media-amazon.com/images/I/61G-m-JvVFL.jpg",
  "Banana": "https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?w=400&q=80",
  "Apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=400&q=80",
  "Orange": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80",
  "Potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80",
  "Onion": "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=400&q=80",
  "Tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80",
  "Chilli": "https://images.unsplash.com/photo-1588015579973-2e453be1ee0d?w=400&q=80",
  "Coriander": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=80",
  "Garlic": "https://images.unsplash.com/photo-1540148426945-1473330af22c?w=400&q=80",
  "Ginger": "https://images.unsplash.com/photo-1595124245239-0118eb3d4d4f?w=400&q=80"
};

function getImage(name) {
    for (const [key, value] of Object.entries(keywordsToImage)) {
        if (name.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }
    return "https://m.media-amazon.com/images/I/61CGHv6kmWL.jpg";
}

function generateBarcode() {
    return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
}

function randomStock() {
    return Math.floor(Math.random() * 90) + 10;
}

const finalProducts = [];

categoriesData.forEach((catObj) => {
    catObj.brands.forEach((brandObj) => {
        brandObj.products.forEach((product) => {
            product.variants.forEach((variant) => {
                const productName = `${brandObj.name} ${product.name} - ${variant.size}`;
                const barcode = generateBarcode();
                const image = getImage(productName);
                
                // Add 10-20% to mrp
                const mrp = variant.price + Math.floor(variant.price * (Math.random() * 0.15 + 0.05));
                
                // Assign to all 5 stores to reach 1000 items easily
                // 116 unique variants * 5 stores = 580 products
                // Let's create an extra 2 entries per store to push to 1000+
                // Wait, if I want 1000 distinct items in the DB, I will just assign each variant to all stores, and perhaps duplicate a few generic items if needed.
                // Or I can assign 8-9 database records per variant across stores by creating a few 'virtual' stores or just using the 5 stores and generating 2 batches.
                // A simpler way: just duplicate them in the same store with slightly different barcodes (like new stock/batch).
                // Let's create exactly 2 distinct batches per store per variant.
                // 116 * 5 stores = 580 * 2 = 1160 products!
                
                stores.forEach((storeId) => {
                    for (let i = 0; i < 2; i++) {
                        finalProducts.push({
                            _id: randomUUID().replace(/-/g, "").slice(0, 24),
                            barcode: generateBarcode(), // unique barcode for each item for scanner compatibility
                            name: productName,
                            price: variant.price,
                            mrp: mrp,
                            image: image,
                            category: catObj.category,
                            stock: randomStock(),
                            storeId: storeId,
                            __v: 0
                        });
                    }
                });
            });
        });
    });
});

fs.writeFileSync("products.json", JSON.stringify(finalProducts, null, 2));

console.log(`Successfully generated ${finalProducts.length} products`);
