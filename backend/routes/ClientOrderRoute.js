const express = require("express");
const router = express.Router();
const ClientOrder = require("../models/ClientOrderSchema");

// POST - place new client order
router.post("/", async (req, res) => {
  
  console.log("POST /api/clientorders hit");
  console.log(req.body);
  res.json({ message: "Order route reached!" })

  try {
    const { customerId, name,email, address, items } = req.body;

    const newOrder = new ClientOrder({
      customerId,
      name,
      email,
      address,
      items
    });

    await newOrder.save();
    console.log("new cliennt order saved")
    res.status(201).json({ message: "Client order placed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - fetch all client orders
router.get("/", async (req, res) => {
  try {
    const orders = await ClientOrder.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
