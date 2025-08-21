const mongoose = require("mongoose");

const clientOrderSchema = new mongoose.Schema({
  customerId: {
    type: Number, // match Customer's auto-increment field
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email:{ 
    type:String,
    required:true
  },
  address: {
    type: String,
    required: true
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

// Yahan 'ClientOrder' naam ka model ban raha hai
const ClientOrder = mongoose.model("ClientOrder", clientOrderSchema);
module.exports = ClientOrder;
