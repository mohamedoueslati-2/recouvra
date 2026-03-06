const mongoose = require('mongoose');
const Utilisateur = require('../models/Utilisateur');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB (Recouvra+)');

    // --- SCRIPT DE CRÉATION DU PREMIER ADMIN ---
    const adminExiste = await Utilisateur.findOne({ role: 'ADMIN' });
    if (!adminExiste) {
      // On passe le mot de passe en clair, le middleware pre('save') le hachera !
      await Utilisateur.create({
        nom: 'Super Admin',
        email: 'admin@recouvra.com',
        motDePasse: 'admin123!',
        role: 'ADMIN'
      });
      console.log('👑 Premier compte ADMIN créé avec succès (admin@recouvra.com / admin123!)');
    }
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;