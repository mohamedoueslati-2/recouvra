const mongoose = require('mongoose');

const actionRecouvrementSchema = new mongoose.Schema({

  facture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facture',
    required: true
  },

  dateAction: {
    type: Date,
    default: Date.now
  },

  commentaire: {
    type: String,
    required: true,
    trim: true
  },

  typeAction: {
    type: String,
    enum: ['APPEL', 'EMAIL', 'COURRIER', 'MISE_EN_DEMEURE'],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('ActionRecouvrement', actionRecouvrementSchema);