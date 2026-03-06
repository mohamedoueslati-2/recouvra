const clientService = require('../services/clientService');
const Joi = require('joi');

const schemaClient = Joi.object({
  raisonSociale: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  telephone: Joi.string().required(),
  adresse: Joi.string().required()
});

const schemaClientMiseAJour = Joi.object({
  raisonSociale: Joi.string().min(2),
  email: Joi.string().email(),
  telephone: Joi.string(),
  adresse: Joi.string()
});

exports.creerClient = async (req, res) => {
  try {
    const client = await clientService.creer(req.body);
    res.status(201).json({ message: "Client créé avec succès", client });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.afficherClients = async (req, res) => {
  try {
    const clients = await clientService.listerTous();
    res.status(200).json(clients);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.afficherClientParId = async (req, res) => {
  try {
    const client = await clientService.trouverParId(req.params.id);
    res.status(200).json(client);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.mettreAJourClient = async (req, res) => {
  try {
    const client = await clientService.mettreAJour(req.params.id, req.body);
    res.status(200).json({ message: "Client mis à jour avec succès", client });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.supprimerClient = async (req, res) => {
  try {
    await clientService.supprimer(req.params.id);
    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.schemaClient = schemaClient;
exports.schemaClientMiseAJour = schemaClientMiseAJour;
