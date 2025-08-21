const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "MasterOrder", 
    required: true 
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productName:{type:String,required:true},
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      amount: { type: Number, required: true, min: 0 }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("OrderDetail", orderDetailSchema);
