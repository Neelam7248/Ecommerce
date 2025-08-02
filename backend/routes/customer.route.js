const express = require("express");
const router = express.Router();
const Customer = require('../models/CustomerSchema');

// GET all customers
router.get("/", async (req, res) => {
  
    try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// ADD new customer
router.post("/", async (req, res) => {
 console.log("Request Body:", req.body);

    try {
    const { name, email } = req.body;
    const newCustomer = new Customer({ name, email });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ error: "Failed to add customer" });
  }
});

// UPDATE customer
router.put("/:_Id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params._Id,
      { name, email },
      { new: true }
    );
    if (!updatedCustomer) return res.status(404).json({ error: "Customer not found" });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ error: "Failed to update customer" });
  }
});

// DELETE customer
router.delete("/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

module.exports = router;
