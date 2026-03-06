const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  facture: { type: mongoose.Schema.Types.ObjectId, ref: 'Facture', required: true },
  montant: { type: Number, required: true, min: 0 },
  datePaiement: { type: Date, default: Date.now },
  reference: { type: String, required: true },
  methode: { 
    type: String, 
    enum: ['VIREMENT', 'CHEQUE', 'ESPECES'], 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Paiement', paiementSchema);
