const Utilisateur = require('../models/Utilisateur');

class UtilisateurService {
  async creer(data) {
    const utilisateurExistant = await Utilisateur.findOne({ email: data.email });
    if (utilisateurExistant) {
      throw { status: 400, message: "Cet email est déjà utilisé." };
    }
    const utilisateur = new Utilisateur(data);
    await utilisateur.save();
    return utilisateur;
  }

  async listerTous() {
    return await Utilisateur.find().select('-motDePasse');
  }

  async trouverParId(id) {
    const utilisateur = await Utilisateur.findById(id).select('-motDePasse');
    if (!utilisateur) {
      throw { status: 404, message: "Utilisateur non trouvé." };
    }
    return utilisateur;
  }

  async mettreAJour(id, data) {
    const utilisateur = await Utilisateur.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-motDePasse');
    if (!utilisateur) {
      throw { status: 404, message: "Utilisateur non trouvé." };
    }
    return utilisateur;
  }

  async supprimer(id) {
    const utilisateur = await Utilisateur.findByIdAndDelete(id);
    if (!utilisateur) {
      throw { status: 404, message: "Utilisateur non trouvé." };
    }
    return utilisateur;
  }
}

module.exports = new UtilisateurService();
