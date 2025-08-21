const mongoose = require('mongoose');
const Product = require('../models/ProductSchema'); // Adjust path as needed

const MONGO_URI = 'mongodb://localhost:27017/EcommerceDB';

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    const products = [
      {
        productId: "72480125",
        name: "Smart Watch",
        price: 4200,
        description: "Water-resistant with health tracking",
        stock: 10
      },
      {
        productId: "72480225",
        name: "Wireless Charger",
        price: 2800,
        description: "Fast charging and sleek design",
        stock: 25
      },
      {
        productId: "72480325",
        name: "Earbuds",
        price: 3200,
        description: "Noise-cancelling and compact",
        stock: 30
      },
      {
        productId: "72480425",
        name: "Wireless Keyboard",
        price: 2500,
        description: "Ergonomic and low-latency",
        stock: 20
      }
    ];

    for (const item of products) {
      try {
        const product = new Product(item);
        await product.save();
        console.log(`🌱 Saved: ${product.name} → ${product.productId}`);
      } catch (err) {
        console.error(`❌ Could not save '${item.name}':`, err.message);
      }
    }

    console.log("🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Database error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Connection closed");
  }
};

seedProducts();
