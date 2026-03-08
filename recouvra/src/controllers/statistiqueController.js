const statistiqueService = require('../services/statistiqueService');

exports.consulterStatistiques = async (req, res) => {

  try {

    const stats = await statistiqueService.getStatistiques();

    res.json(stats);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};