const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  remarks: { type: String },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MasterOrder', orderSchema);
