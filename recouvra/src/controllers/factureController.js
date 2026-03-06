const factureService = require('../services/factureService');
const Joi = require('joi');

const schemaFacture = Joi.object({
  client: Joi.string().required(),
  numeroFacture: Joi.string().required(),
  montantTotal: Joi.number().positive().required(),
  dateEmission: Joi.date().required(),
  dateEcheance: Joi.date().required(),
  statut: Joi.string().valid('EN_ATTENTE', 'EN_RETARD', 'PAYEE_PARTIELLEMENT', 'PAYEE')
});

const schemaFactureMiseAJour = Joi.object({
  dateEcheance: Joi.date(),
  statut: Joi.string().valid('EN_ATTENTE', 'EN_RETARD', 'PAYEE_PARTIELLEMENT', 'PAYEE')
});

exports.creerFacture = async (req, res) => {
  try {
    const facture = await factureService.creer(req.body);
    res.status(201).json({ message: "Facture créée avec succès", facture });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.afficherFactures = async (req, res) => {
  try {
    const factures = await factureService.listerTous();
    res.status(200).json(factures);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.afficherFactureParId = async (req, res) => {
  try {
    const facture = await factureService.trouverParId(req.params.id);
    res.status(200).json(facture);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.afficherFacturesParClient = async (req, res) => {
  try {
    const factures = await factureService.trouverParClient(req.params.clientId);
    res.status(200).json(factures);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.mettreAJourFacture = async (req, res) => {
  try {
    const facture = await factureService.mettreAJour(req.params.id, req.body);
    res.status(200).json({ message: "Facture mise à jour avec succès", facture });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.supprimerFacture = async (req, res) => {
  try {
    await factureService.supprimer(req.params.id);
    res.status(200).json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.schemaFacture = schemaFacture;
exports.schemaFactureMiseAJour = schemaFactureMiseAJour;
