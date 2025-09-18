const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  address: { type: String },
  phone:   { type: String }
});

module.exports = mongoose.model('Supplier', SupplierSchema);
