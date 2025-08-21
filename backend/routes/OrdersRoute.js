const express = require("express");
const router = express.Router();
const Order = require("../models/OrderSchema");
const Product = require("../models/ProductSchema");

// 🛒 POST /api/orders – Place a new order
router.post("/", async (req, res) => {
  try {
    const { customerId, description, items } = req.body;

    // Validation
    if (!customerId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Validate products and stock
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
      validatedItems.push(item);
    }

    // Create new order
    const order = new Order({
      customerId,
      description,
      items: validatedItems
      // orderDate will be set automatically
      // orderId will be auto-incremented
    });

    const savedOrder = await order.save();

    // Reduce stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });

  } catch (err) {
    console.error("❌ Error placing order:", err.message);
    res.status(500).json({ error: "Could not place order", details: err.message });
  }
});

module.exports = router;
