const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { verifierToken } = require('../middlewares/auth'); // Import correct du middleware

// POST /api/auth/connexion (Route publique)
router.post('/connexion', validate(authController.schemaConnexion), authController.connexion);

// GET /api/auth/session (Route protégée)
router.get('/session', verifierToken, authController.verifierSession);

module.exports = router;