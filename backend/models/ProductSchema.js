const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true // ✅ Manual ID like 'P001', 'P002', etc.
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    default: ""
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  }
});

module.exports = mongoose.model('Product', productSchema);
