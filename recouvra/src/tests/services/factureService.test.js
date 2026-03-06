const factureService = require('../../services/factureService');
const Facture = require('../../models/Facture');
const Client = require('../../models/Client');

// Mock des modèles
jest.mock('../../models/Facture');
jest.mock('../../models/Client');

describe('FactureService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREER ====================
  describe('creer', () => {
    const factureData = {
      client: 'client123',
      numeroFacture: 'FAC-2026-001',
      montantTotal: 1500,
      dateEmission: '2026-03-01',
      dateEcheance: '2026-04-01'
    };

    it('devrait créer une facture avec succès', async () => {
      const client = { _id: 'client123', raisonSociale: 'ABC' };
      const factureMock = { 
        _id: 'facture123', 
        ...factureData,
        montantRestant: 1500,
        save: jest.fn().mockResolvedValue() 
      };

      Client.findById.mockResolvedValue(client);
      Facture.mockImplementation(() => factureMock);

      const result = await factureService.creer(factureData);

      expect(Client.findById).toHaveBeenCalledWith('client123');
      expect(factureMock.save).toHaveBeenCalled();
      expect(result.montantRestant).toBe(1500);
    });

    it('devrait échouer si le client n\'existe pas', async () => {
      Client.findById.mockResolvedValue(null);

      await expect(factureService.creer(factureData)).rejects.toEqual({
        status: 404,
        message: "Client introuvable."
      });
    });
  });

  // ==================== LISTER TOUS ====================
  describe('listerTous', () => {
    it('devrait retourner toutes les factures avec client populé', async () => {
      const factures = [
        { _id: 'f1', numeroFacture: 'FAC-001', client: { raisonSociale: 'ABC', email: 'abc@test.com' } },
        { _id: 'f2', numeroFacture: 'FAC-002', client: { raisonSociale: 'XYZ', email: 'xyz@test.com' } }
      ];
      
      Facture.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(factures)
      });

      const result = await factureService.listerTous();

      expect(Facture.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  // ==================== TROUVER PAR ID ====================
  describe('trouverParId', () => {
    it('devrait retourner une facture par son ID', async () => {
      const facture = { _id: 'facture123', numeroFacture: 'FAC-001', client: { raisonSociale: 'ABC' } };
      
      Facture.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(facture)
      });

      const result = await factureService.trouverParId('facture123');

      expect(Facture.findById).toHaveBeenCalledWith('facture123');
      expect(result).toEqual(facture);
    });

    it('devrait échouer si la facture n\'existe pas', async () => {
      Facture.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(factureService.trouverParId('inexistant')).rejects.toEqual({
        status: 404,
        message: "Facture non trouvée."
      });
    });
  });

  // ==================== TROUVER PAR CLIENT ====================
  describe('trouverParClient', () => {
    it('devrait retourner les factures d\'un client', async () => {
      const factures = [
        { _id: 'f1', client: 'client123', numeroFacture: 'FAC-001' },
        { _id: 'f2', client: 'client123', numeroFacture: 'FAC-002' }
      ];
      
      Facture.find.mockResolvedValue(factures);

      const result = await factureService.trouverParClient('client123');

      expect(Facture.find).toHaveBeenCalledWith({ client: 'client123' });
      expect(result).toHaveLength(2);
    });
  });

  // ==================== METTRE A JOUR ====================
  describe('mettreAJour', () => {
    it('devrait mettre à jour une facture', async () => {
      const factureMiseAJour = { 
        _id: 'facture123', 
        statut: 'EN_RETARD' 
      };
      
      Facture.findByIdAndUpdate.mockResolvedValue(factureMiseAJour);

      const result = await factureService.mettreAJour('facture123', { statut: 'EN_RETARD' });

      expect(Facture.findByIdAndUpdate).toHaveBeenCalledWith(
        'facture123',
        { statut: 'EN_RETARD' },
        { new: true, runValidators: true }
      );
      expect(result.statut).toBe('EN_RETARD');
    });

    it('devrait échouer si la facture n\'existe pas', async () => {
      Facture.findByIdAndUpdate.mockResolvedValue(null);

      await expect(factureService.mettreAJour('inexistant', {})).rejects.toEqual({
        status: 404,
        message: "Facture non trouvée."
      });
    });
  });

  // ==================== SUPPRIMER ====================
  describe('supprimer', () => {
    it('devrait supprimer une facture', async () => {
      const facture = { _id: 'facture123' };
      
      Facture.findByIdAndDelete.mockResolvedValue(facture);

      const result = await factureService.supprimer('facture123');

      expect(Facture.findByIdAndDelete).toHaveBeenCalledWith('facture123');
      expect(result).toEqual(facture);
    });

    it('devrait échouer si la facture n\'existe pas', async () => {
      Facture.findByIdAndDelete.mockResolvedValue(null);

      await expect(factureService.supprimer('inexistant')).rejects.toEqual({
        status: 404,
        message: "Facture non trouvée."
      });
    });
  });

  // ==================== METTRE A JOUR MONTANT RESTANT ====================
  describe('mettreAJourMontantRestant', () => {
    it('devrait mettre à jour le montant restant et statut PAYEE_PARTIELLEMENT', async () => {
      const facture = {
        _id: 'facture123',
        montantTotal: 1500,
        montantRestant: 1500,
        statut: 'EN_ATTENTE',
        save: jest.fn().mockResolvedValue()
      };
      
      Facture.findById.mockResolvedValue(facture);

      const result = await factureService.mettreAJourMontantRestant('facture123', 500);

      expect(result.montantRestant).toBe(1000);
      expect(result.statut).toBe('PAYEE_PARTIELLEMENT');
      expect(facture.save).toHaveBeenCalled();
    });

    it('devrait mettre le statut PAYEE si montant restant = 0', async () => {
      const facture = {
        _id: 'facture123',
        montantTotal: 1500,
        montantRestant: 500,
        statut: 'PAYEE_PARTIELLEMENT',
        save: jest.fn().mockResolvedValue()
      };
      
      Facture.findById.mockResolvedValue(facture);

      const result = await factureService.mettreAJourMontantRestant('facture123', 500);

      expect(result.montantRestant).toBe(0);
      expect(result.statut).toBe('PAYEE');
    });

    it('devrait échouer si la facture n\'existe pas', async () => {
      Facture.findById.mockResolvedValue(null);

      await expect(factureService.mettreAJourMontantRestant('inexistant', 100)).rejects.toEqual({
        status: 404,
        message: "Facture introuvable."
      });
    });

    it('devrait échouer si la facture est déjà payée', async () => {
      const facture = {
        _id: 'facture123',
        statut: 'PAYEE',
        montantRestant: 0
      };
      
      Facture.findById.mockResolvedValue(facture);

      await expect(factureService.mettreAJourMontantRestant('facture123', 100)).rejects.toEqual({
        status: 400,
        message: "Cette facture est déjà entièrement payée."
      });
    });

    it('devrait échouer si le montant dépasse le restant dû', async () => {
      const facture = {
        _id: 'facture123',
        statut: 'EN_ATTENTE',
        montantRestant: 500
      };
      
      Facture.findById.mockResolvedValue(facture);

      await expect(factureService.mettreAJourMontantRestant('facture123', 1000)).rejects.toEqual({
        status: 400,
        message: "Le montant dépasse le restant dû (500 TND)."
      });
    });

    it('devrait gérer le paiement exact du montant restant', async () => {
      const facture = {
        _id: 'facture123',
        montantTotal: 1500,
        montantRestant: 500,
        statut: 'PAYEE_PARTIELLEMENT',
        save: jest.fn().mockResolvedValue()
      };
      
      Facture.findById.mockResolvedValue(facture);

      const result = await factureService.mettreAJourMontantRestant('facture123', 500);

      expect(result.montantRestant).toBe(0);
      expect(result.statut).toBe('PAYEE');
    });
  });
});
