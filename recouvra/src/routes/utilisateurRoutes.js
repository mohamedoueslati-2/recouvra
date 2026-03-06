const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');
const validate = require('../middlewares/validate');
const { verifierToken, autoriserRoles } = require('../middlewares/auth');

// Protection : seules les requêtes avec un token valide ET le rôle ADMIN passent
router.use(verifierToken);
router.use(autoriserRoles('ADMIN'));

// CREATE: Créer un utilisateur
router.post('/', validate(utilisateurController.schemaCreation), utilisateurController.creerUtilisateur);

// READ: Afficher tous les utilisateurs
router.get('/', utilisateurController.afficherTousLesUtilisateurs);

// READ: Afficher un utilisateur par ID
router.get('/:id', utilisateurController.afficherUtilisateurParId);

// UPDATE: Mettre à jour un utilisateur
router.put('/:id', validate(utilisateurController.schemaMiseAJour), utilisateurController.mettreAJourUtilisateur);

// DELETE: Supprimer un utilisateur
router.delete('/:id', utilisateurController.supprimerUtilisateur);

module.exports = router;