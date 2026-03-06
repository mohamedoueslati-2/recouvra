const utilisateurService = require('../services/utilisateurService');
const Joi = require('joi');

// Schéma de validation pour la création d'un utilisateur
const schemaCreation = Joi.object({
  nom: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  motDePasse: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'MANAGER', 'AGENT').required()
});

// Schéma de validation pour la mise à jour d'un utilisateur
const schemaMiseAJour = Joi.object({
  nom: Joi.string().min(3),
  email: Joi.string().email(),
  motDePasse: Joi.string().min(6),
  role: Joi.string().valid('ADMIN', 'MANAGER', 'AGENT')
});

// CREATE: Créer un utilisateur
exports.creerUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.creer(req.body);
    res.status(201).json({ 
      message: "Utilisateur créé avec succès", 
      utilisateur: { id: utilisateur._id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role } 
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

// READ: Afficher tous les utilisateurs
exports.afficherTousLesUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await utilisateurService.listerTous();
    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

// READ: Afficher un utilisateur par ID
exports.afficherUtilisateurParId = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.trouverParId(req.params.id);
    res.status(200).json(utilisateur);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

// UPDATE: Mettre à jour un utilisateur
exports.mettreAJourUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.mettreAJour(req.params.id, req.body);
    res.status(200).json({ message: "Utilisateur mis à jour avec succès", utilisateur });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

// DELETE: Supprimer un utilisateur
exports.supprimerUtilisateur = async (req, res) => {
  try {
    await utilisateurService.supprimer(req.params.id);
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erreur serveur" });
  }
};

exports.schemaCreation = schemaCreation;
exports.schemaMiseAJour = schemaMiseAJour;