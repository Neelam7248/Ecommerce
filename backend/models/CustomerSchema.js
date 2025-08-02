const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const customerSchema = new mongoose.Schema({
  customerId: Number, // auto-incremented
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  address: {
    type: String,
    default: ""
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add auto-increment plugin
customerSchema.plugin(AutoIncrement, { inc_field: 'customerId' });

module.exports = mongoose.model("customer", customerSchema);
