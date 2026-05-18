const mongoose = require('mongoose');
require('dotenv').config();

const StoreSchema = new mongoose.Schema({
  name: String,
  distance: String,
  status: String,
  hours: String,
  rewards: String,
  image: String,
  address: String,
  city: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

const Store = mongoose.model('Store', StoreSchema);

const enrichData = {
  "DMart": {
    address: "Tonk Road, near JECRC University Campus",
    city: "Jaipur",
    coordinates: { lat: 26.7885, lng: 75.8722 } // Very close to JECRC University
  },
  "Reliance Store": {
    address: "Sitapura Industrial Area, Sector 5",
    city: "Sitapura",
    coordinates: { lat: 26.7725, lng: 75.8500 }
  },
  "Big Basket": {
    address: "Malviya Nagar Sector 3, opposite Ganna Office",
    city: "Jaipur",
    coordinates: { lat: 26.8533, lng: 75.8248 }
  },
  "Grocius": {
    address: "C-Scheme, near Central Park Gate 2",
    city: "Jaipur",
    coordinates: { lat: 26.9116, lng: 75.8055 }
  },
  "Jio Mart": {
    address: "Vaishali Nagar, Near National Handloom",
    city: "Jaipur",
    coordinates: { lat: 26.9064, lng: 75.7360 }
  }
};

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB...");
  
  const stores = await Store.find({});
  console.log(`Found ${stores.length} stores to enrich.`);
  
  for (const store of stores) {
    const details = enrichData[store.name];
    if (details) {
      store.address = details.address;
      store.city = details.city;
      store.coordinates = details.coordinates;
      await store.save();
      console.log(`Enriched store ${store.name} with coordinates:`, details.coordinates);
    }
  }
  
  console.log("Store enrichment complete!");
  process.exit(0);
}

main().catch(err => {
  console.error("Enrichment failed:", err);
  process.exit(1);
});
