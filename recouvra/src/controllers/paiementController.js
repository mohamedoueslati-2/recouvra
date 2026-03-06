const paiementService = require('../services/paiementService');
const Joi = require('joi');

const schemaPaiement = Joi.object({
  facture: Joi.string().required(),
  montant: Joi.number().positive().required(),
  reference: Joi.string().required(),
  methode: Joi.string().valid('VIREMENT', 'CHEQUE', 'ESPECES').required()
});

exports.creerPaiement = async (req, res) => {
  try {
    const { paiement, facture } = await paiementService.creer(req.body);
    res.status(201).json({ message: "Paiement enregistré avec succès", paiement, facture });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.afficherPaiements = async (req, res) => {
  try {
    const paiements = await paiementService.listerTous();
    res.status(200).json(paiements);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.afficherPaiementsParFacture = async (req, res) => {
  try {
    const paiements = await paiementService.trouverParFacture(req.params.factureId);
    res.status(200).json(paiements);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.schemaPaiement = schemaPaiement;
