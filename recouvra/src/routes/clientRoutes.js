const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const validate = require('../middlewares/validate');
const { verifierToken, autoriserRoles } = require('../middlewares/auth');

router.use(verifierToken);
router.use(autoriserRoles('MANAGER', 'AGENT'));

router.post('/', validate(clientController.schemaClient), clientController.creerClient);
router.get('/', clientController.afficherClients);
router.get('/:id', clientController.afficherClientParId);
router.put('/:id', validate(clientController.schemaClientMiseAJour), clientController.mettreAJourClient);
router.delete('/:id', clientController.supprimerClient);

module.exports = router;
