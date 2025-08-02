const express = require("express");
const router = express.Router();
const Product = require("../models/ProductSchema");

// 🔹 Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

module.exports = router;
