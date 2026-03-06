const Utilisateur = require('../models/Utilisateur');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schemaConnexion = Joi.object({
  email: Joi.string().email().required(),
  motDePasse: Joi.string().required()
});

// Méthode pour la connexion
exports.connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const motDePasseValide = await utilisateur.comparerMotDePasse(motDePasse);
    if (!motDePasseValide) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: utilisateur._id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: "Connexion réussie", token, role: utilisateur.role });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", erreur: error.message });
  }
};

// Méthode pour vérifier la session
exports.verifierSession = async (req, res) => {
  try {
    // Les informations de l'utilisateur sont déjà disponibles dans req.utilisateur grâce au middleware verifierToken
    const utilisateur = req.utilisateur;

    res.json({
      message: "Session valide",
      utilisateur: {
        id: utilisateur.id,
        role: utilisateur.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", erreur: error.message });
  }
};

// Exporter le schéma de validation
exports.schemaConnexion = schemaConnexion;