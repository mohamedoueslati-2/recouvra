const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');
const validate = require('../middlewares/validate');
const { verifierToken, autoriserRoles } = require('../middlewares/auth');

router.use(verifierToken);
router.use(autoriserRoles('MANAGER', 'AGENT'));

router.post('/', validate(paiementController.schemaPaiement), paiementController.creerPaiement);
router.get('/', paiementController.afficherPaiements);
router.get('/facture/:factureId', paiementController.afficherPaiementsParFacture);

module.exports = router;
