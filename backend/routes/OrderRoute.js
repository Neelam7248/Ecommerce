const express = require("express");
const router = express.Router();
const Order = require("../models/OrderSchema");
const Product = require("../models/ProductSchema");

// 🛒 POST /api/orders – Place a new order
router.post("/", async (req, res) => {
  try {
    const { customerId,name, address, items } = req.body;
console.log("✅ Order received:", {
  customerId,
  name,         // should be string ID
  address,          // should be string
  items             // should be an array
});

console.log("📦 Items array type:", Array.isArray(items));
console.log("🔢 Items count:", items.length);
    // 🧾 Basic validation for incoming data
    if (!customerId||!name || !address || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // 🧠 Log raw payload for debugging
    console.log("🚚 Incoming order:", JSON.stringify({ customerId,name, address, items }, null, 2));

    // ✅ Step 1: Validate products and stock levels
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name} (${product.stock} available)`
        });
      }

      // Push validated item with product ref
      validatedItems.push(item);
    }

    // ✅ Step 2: Create and save the order
    const order = new Order({
      customerId,
     name,
      address,
      items: validatedItems
    });

    const savedOrder = await order.save();
    console.log("✅ Order saved:", savedOrder);

    // 🔄 Step 3: Reduce stock for each product
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // ✅ Step 4: Send confirmation
    return res.status(201).json({ message: "Order placed successfully", order: savedOrder });

  } catch (err) {
    console.error("❌ Error placing order:", err.message);
    return res.status(500).json({ error: "Could not place order", details: err.message });
  }
});

module.exports = router;
