const mongoose = require("mongoose");
const Counter = require("./Counter");

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true }, // int primary key
  name: { type: String, required: true, unique: false, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: "" },
  stock: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

// Auto-increment integer ID
productSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "productId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.productId = counter.seq; // simple integer
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
