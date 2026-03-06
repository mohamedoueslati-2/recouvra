const paiementService = require('../../services/paiementService');
const Paiement = require('../../models/Paiement');
const factureService = require('../../services/factureService');

// Mock des dépendances
jest.mock('../../models/Paiement');
jest.mock('../../services/factureService');

describe('PaiementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREER ====================
  describe('creer', () => {
    const paiementData = {
      facture: 'facture123',
      montant: 500,
      reference: 'VIR-2026-001',
      methode: 'VIREMENT'
    };

    it('devrait créer un paiement et mettre à jour la facture', async () => {
      const factureUpdated = {
        _id: 'facture123',
        montantRestant: 1000,
        statut: 'PAYEE_PARTIELLEMENT'
      };
      const paiementMock = {
        _id: 'paiement123',
        ...paiementData,
        save: jest.fn().mockResolvedValue()
      };

      factureService.mettreAJourMontantRestant.mockResolvedValue(factureUpdated);
      Paiement.mockImplementation(() => paiementMock);

      const result = await paiementService.creer(paiementData);

      expect(factureService.mettreAJourMontantRestant).toHaveBeenCalledWith('facture123', 500);
      expect(paiementMock.save).toHaveBeenCalled();
      expect(result.paiement).toEqual(paiementMock);
      expect(result.facture).toEqual(factureUpdated);
    });

    it('devrait propager l\'erreur si facture introuvable', async () => {
      factureService.mettreAJourMontantRestant.mockRejectedValue({
        status: 404,
        message: "Facture introuvable."
      });

      await expect(paiementService.creer(paiementData)).rejects.toEqual({
        status: 404,
        message: "Facture introuvable."
      });
    });

    it('devrait propager l\'erreur si facture déjà payée', async () => {
      factureService.mettreAJourMontantRestant.mockRejectedValue({
        status: 400,
        message: "Cette facture est déjà entièrement payée."
      });

      await expect(paiementService.creer(paiementData)).rejects.toEqual({
        status: 400,
        message: "Cette facture est déjà entièrement payée."
      });
    });

    it('devrait propager l\'erreur si montant dépasse restant', async () => {
      factureService.mettreAJourMontantRestant.mockRejectedValue({
        status: 400,
        message: "Le montant dépasse le restant dû (300 TND)."
      });

      await expect(paiementService.creer({ ...paiementData, montant: 500 })).rejects.toEqual({
        status: 400,
        message: "Le montant dépasse le restant dû (300 TND)."
      });
    });
  });

  // ==================== LISTER TOUS ====================
  describe('listerTous', () => {
    it('devrait retourner tous les paiements avec facture populée', async () => {
      const paiements = [
        { _id: 'p1', montant: 500, facture: { numeroFacture: 'FAC-001', montantTotal: 1500 } },
        { _id: 'p2', montant: 300, facture: { numeroFacture: 'FAC-002', montantTotal: 2000 } }
      ];

      Paiement.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(paiements)
      });

      const result = await paiementService.listerTous();

      expect(Paiement.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('devrait retourner un tableau vide si aucun paiement', async () => {
      Paiement.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([])
      });

      const result = await paiementService.listerTous();

      expect(result).toEqual([]);
    });
  });

  // ==================== TROUVER PAR FACTURE ====================
  describe('trouverParFacture', () => {
    it('devrait retourner les paiements d\'une facture', async () => {
      const paiements = [
        { _id: 'p1', facture: 'facture123', montant: 500, methode: 'VIREMENT' },
        { _id: 'p2', facture: 'facture123', montant: 300, methode: 'CHEQUE' }
      ];

      Paiement.find.mockResolvedValue(paiements);

      const result = await paiementService.trouverParFacture('facture123');

      expect(Paiement.find).toHaveBeenCalledWith({ facture: 'facture123' });
      expect(result).toHaveLength(2);
    });

    it('devrait retourner un tableau vide si aucun paiement pour cette facture', async () => {
      Paiement.find.mockResolvedValue([]);

      const result = await paiementService.trouverParFacture('facture123');

      expect(result).toEqual([]);
    });
  });

  // ==================== TESTS METHODES DE PAIEMENT ====================
  describe('méthodes de paiement', () => {
    it('devrait accepter un paiement par VIREMENT', async () => {
      const factureUpdated = { _id: 'f1', montantRestant: 1000, statut: 'PAYEE_PARTIELLEMENT' };
      const paiementMock = { 
        _id: 'p1', 
        methode: 'VIREMENT',
        save: jest.fn().mockResolvedValue() 
      };

      factureService.mettreAJourMontantRestant.mockResolvedValue(factureUpdated);
      Paiement.mockImplementation(() => paiementMock);

      const result = await paiementService.creer({
        facture: 'f1', montant: 500, reference: 'VIR-001', methode: 'VIREMENT'
      });

      expect(result.paiement.methode).toBe('VIREMENT');
    });

    it('devrait accepter un paiement par CHEQUE', async () => {
      const factureUpdated = { _id: 'f1', montantRestant: 700, statut: 'PAYEE_PARTIELLEMENT' };
      const paiementMock = { 
        _id: 'p1', 
        methode: 'CHEQUE',
        save: jest.fn().mockResolvedValue() 
      };

      factureService.mettreAJourMontantRestant.mockResolvedValue(factureUpdated);
      Paiement.mockImplementation(() => paiementMock);

      const result = await paiementService.creer({
        facture: 'f1', montant: 300, reference: 'CHQ-001', methode: 'CHEQUE'
      });

      expect(result.paiement.methode).toBe('CHEQUE');
    });

    it('devrait accepter un paiement par ESPECES', async () => {
      const factureUpdated = { _id: 'f1', montantRestant: 0, statut: 'PAYEE' };
      const paiementMock = { 
        _id: 'p1', 
        methode: 'ESPECES',
        save: jest.fn().mockResolvedValue() 
      };

      factureService.mettreAJourMontantRestant.mockResolvedValue(factureUpdated);
      Paiement.mockImplementation(() => paiementMock);

      const result = await paiementService.creer({
        facture: 'f1', montant: 700, reference: 'ESP-001', methode: 'ESPECES'
      });

      expect(result.paiement.methode).toBe('ESPECES');
      expect(result.facture.statut).toBe('PAYEE');
    });
  });
});
