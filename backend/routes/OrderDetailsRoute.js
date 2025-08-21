// routes/orderDetails.js
const express = require('express');
const router = express.Router();
const OrderDetail = require('../models/OrderDetail');

router.post('/', async (req, res) => {
  try {
    const { orderId, items } = req.body;

    if (!orderId || !items || items.length === 0) {
      return res.status(400).json({ error: 'OrderID and items are required' });
    }

    // ✅ Save one document with all items
    const orderDetail = new OrderDetail({
      orderId,
      items
    });

    await orderDetail.save();

    res.status(201).json({ message: 'Order details saved successfully', orderDetail });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ Get order details by orderId
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find order detail with items
    const orderDetail = await OrderDetail.findOne({ orderId })
      .populate({
        path: "orderId",
        populate: { path: "customerId" } // customer info fetch
      })
      .populate("items.productId"); // product info fetch

    if (!orderDetail) {
      return res.status(404).json({ error: "Order not found" });
    }

    // ✅ Custom response structure
    res.json({
      customer: {
        name: orderDetail.orderId.customerId.name,
        email: orderDetail.orderId.customerId.email,
        address: orderDetail.orderId.customerId.address,
      },
      items: orderDetail.items.map(item => ({
        name: item.productName || item.productId.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: orderDetail.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      createdAt: orderDetail.createdAt
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
