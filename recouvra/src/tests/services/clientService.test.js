const clientService = require('../../services/clientService');
const Client = require('../../models/Client');

// Mock du modèle Client
jest.mock('../../models/Client');

describe('ClientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREER ====================
  describe('creer', () => {
    const clientData = {
      raisonSociale: 'Société ABC',
      email: 'contact@abc.com',
      telephone: '71234567',
      adresse: 'Tunis, Tunisie'
    };

    it('devrait créer un client avec succès', async () => {
      const clientMock = { _id: 'client123', ...clientData, save: jest.fn().mockResolvedValue() };
      
      Client.findOne.mockResolvedValue(null);
      Client.mockImplementation(() => clientMock);

      const result = await clientService.creer(clientData);

      expect(Client.findOne).toHaveBeenCalledWith({ email: clientData.email });
      expect(clientMock.save).toHaveBeenCalled();
      expect(result).toEqual(clientMock);
    });

    it('devrait échouer si l\'email existe déjà', async () => {
      Client.findOne.mockResolvedValue({ _id: 'existant', email: clientData.email });

      await expect(clientService.creer(clientData)).rejects.toEqual({
        status: 400,
        message: "Cet email est déjà utilisé."
      });
    });
  });

  // ==================== LISTER TOUS ====================
  describe('listerTous', () => {
    it('devrait retourner la liste de tous les clients', async () => {
      const clients = [
        { _id: 'client1', raisonSociale: 'ABC', email: 'abc@test.com' },
        { _id: 'client2', raisonSociale: 'XYZ', email: 'xyz@test.com' }
      ];
      
      Client.find.mockResolvedValue(clients);

      const result = await clientService.listerTous();

      expect(Client.find).toHaveBeenCalled();
      expect(result).toEqual(clients);
      expect(result).toHaveLength(2);
    });

    it('devrait retourner un tableau vide si aucun client', async () => {
      Client.find.mockResolvedValue([]);

      const result = await clientService.listerTous();

      expect(result).toEqual([]);
    });
  });

  // ==================== TROUVER PAR ID ====================
  describe('trouverParId', () => {
    it('devrait retourner un client par son ID', async () => {
      const client = { _id: 'client123', raisonSociale: 'ABC', email: 'abc@test.com' };
      
      Client.findById.mockResolvedValue(client);

      const result = await clientService.trouverParId('client123');

      expect(Client.findById).toHaveBeenCalledWith('client123');
      expect(result).toEqual(client);
    });

    it('devrait échouer si le client n\'existe pas', async () => {
      Client.findById.mockResolvedValue(null);

      await expect(clientService.trouverParId('inexistant')).rejects.toEqual({
        status: 404,
        message: "Client non trouvé."
      });
    });
  });

  // ==================== METTRE A JOUR ====================
  describe('mettreAJour', () => {
    it('devrait mettre à jour un client', async () => {
      const clientMisAJour = { 
        _id: 'client123', 
        raisonSociale: 'ABC', 
        email: 'abc@test.com',
        telephone: '99999999' 
      };
      
      Client.findByIdAndUpdate.mockResolvedValue(clientMisAJour);

      const result = await clientService.mettreAJour('client123', { telephone: '99999999' });

      expect(Client.findByIdAndUpdate).toHaveBeenCalledWith(
        'client123',
        { telephone: '99999999' },
        { new: true, runValidators: true }
      );
      expect(result.telephone).toBe('99999999');
    });

    it('devrait échouer si le client n\'existe pas', async () => {
      Client.findByIdAndUpdate.mockResolvedValue(null);

      await expect(clientService.mettreAJour('inexistant', { telephone: '99999999' })).rejects.toEqual({
        status: 404,
        message: "Client non trouvé."
      });
    });
  });

  // ==================== SUPPRIMER ====================
  describe('supprimer', () => {
    it('devrait supprimer un client', async () => {
      const client = { _id: 'client123', raisonSociale: 'ABC' };
      
      Client.findByIdAndDelete.mockResolvedValue(client);

      const result = await clientService.supprimer('client123');

      expect(Client.findByIdAndDelete).toHaveBeenCalledWith('client123');
      expect(result).toEqual(client);
    });

    it('devrait échouer si le client n\'existe pas', async () => {
      Client.findByIdAndDelete.mockResolvedValue(null);

      await expect(clientService.supprimer('inexistant')).rejects.toEqual({
        status: 404,
        message: "Client non trouvé."
      });
    });
  });
});
