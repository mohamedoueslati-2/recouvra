const actionService = require('../services/actionRecouvrementService');


// 🔹 Créer une action de recouvrement
exports.ajouterAction = async (req, res) => {
  try {

    const action = await actionService.ajouterAction(req.body);

    res.status(201).json({
      message: "Action de recouvrement créée avec succès",
      action
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


// 🔹 Suivre les actions d'une facture
exports.suivreActionsFacture = async (req, res) => {
  try {

    const actions = await actionService.suivreActionsFacture(req.params.factureId);

    res.json(actions);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};