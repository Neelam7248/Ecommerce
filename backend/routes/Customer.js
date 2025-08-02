const express = require("express");
const router = express.Router();
const Customer = require("../models/CustomerSchema"); // Capitalized for model

// 🔹 Create Customer
router.post("/", async (req, res) => {
  try {
    
    const newCustomer = new Customer(req.body); // Use model constructor properly
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error); // Helpful during debugging
    res.status(500).json({ error: "Customer creation failed." });
  }
});

module.exports = router;
