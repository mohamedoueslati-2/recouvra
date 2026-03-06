const utilisateurService = require('../../services/utilisateurService');
const Utilisateur = require('../../models/Utilisateur');

// Mock du modèle Utilisateur
jest.mock('../../models/Utilisateur');

describe('UtilisateurService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREER ====================
  describe('creer', () => {
    const utilisateurData = {
      nom: 'Agent Test',
      email: 'agent@test.com',
      motDePasse: 'agent123',
      role: 'AGENT'
    };

    it('devrait créer un utilisateur AGENT avec succès', async () => {
      const utilisateurMock = { 
        _id: 'user123', 
        ...utilisateurData,
        save: jest.fn().mockResolvedValue() 
      };

      Utilisateur.findOne.mockResolvedValue(null);
      Utilisateur.mockImplementation(() => utilisateurMock);

      const result = await utilisateurService.creer(utilisateurData);

      expect(Utilisateur.findOne).toHaveBeenCalledWith({ email: utilisateurData.email });
      expect(utilisateurMock.save).toHaveBeenCalled();
      expect(result.role).toBe('AGENT');
    });

    it('devrait créer un utilisateur MANAGER avec succès', async () => {
      const managerData = { ...utilisateurData, role: 'MANAGER', email: 'manager@test.com' };
      const utilisateurMock = { 
        _id: 'user124', 
        ...managerData,
        save: jest.fn().mockResolvedValue() 
      };

      Utilisateur.findOne.mockResolvedValue(null);
      Utilisateur.mockImplementation(() => utilisateurMock);

      const result = await utilisateurService.creer(managerData);

      expect(result.role).toBe('MANAGER');
    });

    it('devrait créer un utilisateur ADMIN avec succès', async () => {
      const adminData = { ...utilisateurData, role: 'ADMIN', email: 'admin@test.com' };
      const utilisateurMock = { 
        _id: 'user125', 
        ...adminData,
        save: jest.fn().mockResolvedValue() 
      };

      Utilisateur.findOne.mockResolvedValue(null);
      Utilisateur.mockImplementation(() => utilisateurMock);

      const result = await utilisateurService.creer(adminData);

      expect(result.role).toBe('ADMIN');
    });

    it('devrait échouer si l\'email existe déjà', async () => {
      Utilisateur.findOne.mockResolvedValue({ _id: 'existant', email: utilisateurData.email });

      await expect(utilisateurService.creer(utilisateurData)).rejects.toEqual({
        status: 400,
        message: "Cet email est déjà utilisé."
      });
    });
  });

  // ==================== LISTER TOUS ====================
  describe('listerTous', () => {
    it('devrait retourner tous les utilisateurs sans mot de passe', async () => {
      const utilisateurs = [
        { _id: 'u1', nom: 'Admin', email: 'admin@test.com', role: 'ADMIN' },
        { _id: 'u2', nom: 'Agent', email: 'agent@test.com', role: 'AGENT' }
      ];

      Utilisateur.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(utilisateurs)
      });

      const result = await utilisateurService.listerTous();

      expect(Utilisateur.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      // Vérifier que le mot de passe n'est pas inclus
      result.forEach(u => expect(u.motDePasse).toBeUndefined());
    });

    it('devrait retourner un tableau vide si aucun utilisateur', async () => {
      Utilisateur.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([])
      });

      const result = await utilisateurService.listerTous();

      expect(result).toEqual([]);
    });
  });

  // ==================== TROUVER PAR ID ====================
  describe('trouverParId', () => {
    it('devrait retourner un utilisateur par son ID sans mot de passe', async () => {
      const utilisateur = { _id: 'user123', nom: 'Test', email: 'test@test.com', role: 'AGENT' };

      Utilisateur.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(utilisateur)
      });

      const result = await utilisateurService.trouverParId('user123');

      expect(Utilisateur.findById).toHaveBeenCalledWith('user123');
      expect(result).toEqual(utilisateur);
      expect(result.motDePasse).toBeUndefined();
    });

    it('devrait échouer si l\'utilisateur n\'existe pas', async () => {
      Utilisateur.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(utilisateurService.trouverParId('inexistant')).rejects.toEqual({
        status: 404,
        message: "Utilisateur non trouvé."
      });
    });
  });

  // ==================== METTRE A JOUR ====================
  describe('mettreAJour', () => {
    it('devrait mettre à jour le nom d\'un utilisateur', async () => {
      const utilisateurMisAJour = { 
        _id: 'user123', 
        nom: 'Nouveau Nom',
        email: 'test@test.com',
        role: 'AGENT'
      };

      Utilisateur.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(utilisateurMisAJour)
      });

      const result = await utilisateurService.mettreAJour('user123', { nom: 'Nouveau Nom' });

      expect(Utilisateur.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { nom: 'Nouveau Nom' },
        { new: true, runValidators: true }
      );
      expect(result.nom).toBe('Nouveau Nom');
    });

    it('devrait mettre à jour le rôle d\'un utilisateur', async () => {
      const utilisateurMisAJour = { 
        _id: 'user123', 
        nom: 'Test',
        role: 'MANAGER'
      };

      Utilisateur.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(utilisateurMisAJour)
      });

      const result = await utilisateurService.mettreAJour('user123', { role: 'MANAGER' });

      expect(result.role).toBe('MANAGER');
    });

    it('devrait échouer si l\'utilisateur n\'existe pas', async () => {
      Utilisateur.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(utilisateurService.mettreAJour('inexistant', { nom: 'Test' })).rejects.toEqual({
        status: 404,
        message: "Utilisateur non trouvé."
      });
    });
  });

  // ==================== SUPPRIMER ====================
  describe('supprimer', () => {
    it('devrait supprimer un utilisateur', async () => {
      const utilisateur = { _id: 'user123', nom: 'Test' };

      Utilisateur.findByIdAndDelete.mockResolvedValue(utilisateur);

      const result = await utilisateurService.supprimer('user123');

      expect(Utilisateur.findByIdAndDelete).toHaveBeenCalledWith('user123');
      expect(result).toEqual(utilisateur);
    });

    it('devrait échouer si l\'utilisateur n\'existe pas', async () => {
      Utilisateur.findByIdAndDelete.mockResolvedValue(null);

      await expect(utilisateurService.supprimer('inexistant')).rejects.toEqual({
        status: 404,
        message: "Utilisateur non trouvé."
      });
    });
  });

  // ==================== TESTS PAR ROLE ====================
  describe('gestion des rôles', () => {
    it('devrait permettre de créer les 3 types de rôles', async () => {
      const roles = ['ADMIN', 'MANAGER', 'AGENT'];
      
      for (const role of roles) {
        const userData = {
          nom: `Test ${role}`,
          email: `${role.toLowerCase()}@test.com`,
          motDePasse: 'test123',
          role
        };
        
        const userMock = { 
          _id: `id${role}`, 
          ...userData,
          save: jest.fn().mockResolvedValue() 
        };

        Utilisateur.findOne.mockResolvedValue(null);
        Utilisateur.mockImplementation(() => userMock);

        const result = await utilisateurService.creer(userData);
        expect(result.role).toBe(role);
      }
    });
  });
});
