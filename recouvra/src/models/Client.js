const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  raisonSociale: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  telephone: { type: String, required: true },
  adresse: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
