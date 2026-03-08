const ActionRecouvrement = require('../models/ActionRecouvrement');

class ActionRecouvrementService {
    // 🔹 créer une action de recouvrement
  async ajouterAction(data) {

    const action = new ActionRecouvrement(data);

    return await action.save();

  }
    // 🔹 suivre les actions de recouvrement d'une facture

  async suivreActionsFacture(factureId) {
    return await ActionRecouvrement
      .find({ facture: factureId })
      .sort({ dateAction: -1 });
  }

}

module.exports = new ActionRecouvrementService();