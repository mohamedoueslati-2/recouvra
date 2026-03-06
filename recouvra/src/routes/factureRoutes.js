const express = require('express');
const router = express.Router();
const factureController = require('../controllers/factureController');
const validate = require('../middlewares/validate');
const { verifierToken, autoriserRoles } = require('../middlewares/auth');

router.use(verifierToken);
router.use(autoriserRoles('MANAGER', 'AGENT'));

router.post('/', validate(factureController.schemaFacture), factureController.creerFacture);
router.get('/', factureController.afficherFactures);
router.get('/client/:clientId', factureController.afficherFacturesParClient);
router.get('/:id', factureController.afficherFactureParId);
router.put('/:id', validate(factureController.schemaFactureMiseAJour), factureController.mettreAJourFacture);
router.delete('/:id', factureController.supprimerFacture);

module.exports = router;
