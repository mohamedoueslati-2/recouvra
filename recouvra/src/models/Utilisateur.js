const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  motDePasse: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'MANAGER', 'AGENT'], 
    default: 'AGENT' 
  }
}, { timestamps: true });

// Hachage du mot de passe avant la sauvegarde (Correctif async)
utilisateurSchema.pre('save', async function () {
  // Si le mot de passe n'est pas modifié, on sort de la fonction
  if (!this.isModified('motDePasse')) return;

  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  // Avec async, pas besoin de next(), la fin de la fonction suffit
});

// Méthode de vérification du mot de passe
utilisateurSchema.methods.comparerMotDePasse = async function (motDePasseSaisi) {
  return await bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);