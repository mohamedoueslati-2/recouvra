const mongoose = require('mongoose');

const factureSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  numeroFacture: { type: String, required: true, unique: true },
  montantTotal: { type: Number, required: true, min: 0 },
  montantRestant: { type: Number, required: true, min: 0 },
  dateEmission: { type: Date, required: true },
  dateEcheance: { type: Date, required: true },
  statut: { 
    type: String, 
    enum: ['EN_ATTENTE', 'EN_RETARD', 'PAYEE_PARTIELLEMENT', 'PAYEE'], 
    default: 'EN_ATTENTE' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Facture', factureSchema);
