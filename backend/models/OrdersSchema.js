const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, unique: true }, // Auto-increment order number
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  description: { type: String },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    }
  ],
  orderDate: { type: Date, default: Date.now }
});

// Auto-increment orderId
orderSchema.plugin(AutoIncrement, { inc_field: "orderId" });

module.exports = mongoose.model("Order", orderSchema);
