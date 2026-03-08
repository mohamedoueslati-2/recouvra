const express = require('express');
const router = express.Router();

const controller = require('../controllers/actionRecouvrementController');
// 🔹 créer une action de recouvrement
router.post('/', controller.ajouterAction);
// 🔹 suivre les actions de recouvrement d'une facture
router.get('/facture/:factureId', controller.suivreActionsFacture);

module.exports = router;