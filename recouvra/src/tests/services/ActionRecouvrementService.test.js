const actionRecouvrementService = require('../../services/actionRecouvrementService');
const ActionRecouvrement = require('../../models/ActionRecouvrement');

jest.mock('../../models/ActionRecouvrement');

describe('ActionRecouvrementService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREER ====================
  describe('ajouterAction', () => {

    const actionData = {
      facture: 'facture123',
      typeAction: 'APPEL',
      commentaire: 'Relance téléphonique'
    };

    it('devrait créer une action de recouvrement', async () => {

      // créer l'objet mock
      const actionMock = {
        _id: 'action123',
        ...actionData
      };

      // ajouter la fonction save mockée
      actionMock.save = jest.fn().mockResolvedValue(actionMock);

      // mock du modèle mongoose
      ActionRecouvrement.mockImplementation(() => actionMock);

      const result = await actionRecouvrementService.ajouterAction(actionData);

      expect(ActionRecouvrement).toHaveBeenCalledWith(actionData);
      expect(actionMock.save).toHaveBeenCalled();
      expect(result).toEqual(actionMock);

    });

  });

  // ==================== SUIVRE ACTIONS ====================
  describe('suivreActionsFacture', () => {

    it('devrait retourner les actions d’une facture', async () => {

      const actions = [
        { _id: 'a1', typeAction: 'APPEL' },
        { _id: 'a2', typeAction: 'EMAIL' }
      ];

      ActionRecouvrement.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(actions)
      });

      const result = await actionRecouvrementService.suivreActionsFacture('facture123');

      expect(ActionRecouvrement.find).toHaveBeenCalledWith({ facture: 'facture123' });
      expect(result).toHaveLength(2);

    });

  });

});