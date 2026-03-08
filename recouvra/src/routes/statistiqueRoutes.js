const express = require('express');
const router = express.Router();

const statistiqueController = require('../controllers/statistiqueController');
const { verifierToken, autoriserRoles } = require('../middlewares/auth');

router.get(
  '/statistiques',
  verifierToken,
  autoriserRoles('MANAGER'),  
  statistiqueController.consulterStatistiques
);

module.exports = router;