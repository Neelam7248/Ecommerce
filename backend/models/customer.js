const mongoose = require("mongoose");

// Define Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

// Create Model
const Customer = mongoose.model("CustomerN", customerSchema)