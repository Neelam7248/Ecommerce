// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/MasterOrderSchema');

router.post('/', async (req, res) => {
  try {
    const { customerId, remarks, orderDate } = req.body;
    const order = new Order({ 
      customerId, 
      remarks, 
      orderDate: orderDate ? new Date(orderDate) : Date.now() 
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
