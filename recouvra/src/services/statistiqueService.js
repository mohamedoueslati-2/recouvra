const Facture = require('../models/Facture');
const ActionRecouvrement = require('../models/ActionRecouvrement');

class StatistiqueService {

  async getStatistiques() {

    const totalFactures = await Facture.countDocuments();

    const facturesEnAttente = await Facture.countDocuments({ statut: "EN_ATTENTE" });

    const facturesEnRetard = await Facture.countDocuments({ statut: "EN_RETARD" });

    const facturesPayees = await Facture.countDocuments({ statut: "PAYEE" });

    const montantTotal = await Facture.aggregate([
      { $group: { _id: null, total: { $sum: "$montantTotal" } } }
    ]);

    const montantRestant = await Facture.aggregate([
      { $group: { _id: null, total: { $sum: "$montantRestant" } } }
    ]);

    const totalActions = await ActionRecouvrement.countDocuments();

    return {
      totalFactures,
      facturesEnAttente,
      facturesEnRetard,
      facturesPayees,
      montantTotal: montantTotal[0]?.total || 0,
      montantRestant: montantRestant[0]?.total || 0,
      totalActions
    };

  }

}

module.exports = new StatistiqueService();