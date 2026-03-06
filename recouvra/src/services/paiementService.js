const Paiement = require('../models/Paiement');
const factureService = require('./factureService');

class PaiementService {
  async creer(data) {
    // Valider et mettre à jour la facture
    const facture = await factureService.mettreAJourMontantRestant(data.facture, data.montant);

    const paiement = new Paiement(data);
    await paiement.save();

    return { paiement, facture };
  }

  async listerTous() {
    return await Paiement.find().populate('facture', 'numeroFacture montantTotal');
  }

  async trouverParFacture(factureId) {
    return await Paiement.find({ facture: factureId });
  }
}

module.exports = new PaiementService();
