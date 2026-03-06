# Recouvra API

API REST backend avec **Express.js** pour gérer les clients, les factures impayées et les paiements d'une entreprise.

---

## Prérequis

- [Node.js](https://nodejs.org/) v22+
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)

---

## Installation

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd recouvra/recouvra

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# puis éditer le fichier .env
```

---

## Configuration — fichier `.env`

Créer un fichier `.env` à la racine du dossier `recouvra/` :

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/recouvra_api
JWT_SECRET=changez_moi_en_production
JWT_EXPIRES_IN=7d
```

| Variable       | Description                              | Exemple                                      |
|----------------|------------------------------------------|----------------------------------------------|
| `PORT`         | Port du serveur Express                  | `3000`                                       |
| `MONGO_URI`    | URI de connexion MongoDB                 | `mongodb://127.0.0.1:27017/recouvra_api`     |
| `JWT_SECRET`   | Clé secrète pour signer les tokens JWT   | `une_cle_longue_et_aleatoire`                |
| `JWT_EXPIRES_IN` | Durée de validité du token JWT         | `7d`, `1d`, `24h`                            |

---

## Démarrage

```bash
# Démarrer le serveur
npm start

# Lancer les tests
npm test
```

Le serveur démarre sur **http://localhost:3000**  
La documentation Swagger est disponible sur **http://localhost:3000/api-docs**

---

## Structure du projet

```
recouvra/
└── src/
    ├── app.js                  # Point d'entrée Express
    ├── config/
    │   ├── db.js               # Connexion MongoDB
    │   └── swagger.js          # Configuration Swagger/OpenAPI
    ├── controllers/            # Logique des routes (req/res)
    │   ├── authController.js
    │   ├── utilisateurController.js
    │   ├── clientController.js
    │   ├── factureController.js
    │   └── paiementController.js
    ├── middlewares/
    │   ├── auth.js             # Vérification JWT + rôles
    │   └── validate.js         # Validation Joi
    ├── models/                 # Schémas Mongoose
    │   ├── Utilisateur.js
    │   ├── Client.js
    │   ├── Facture.js
    │   └── Paiement.js
    ├── routes/                 # Définition des routes
    │   ├── authRoutes.js
    │   ├── utilisateurRoutes.js
    │   ├── clientRoutes.js
    │   ├── factureRoutes.js
    │   └── paiementRoutes.js
    ├── services/               # Logique métier
    │   ├── utilisateurService.js
    │   ├── clientService.js
    │   ├── factureService.js
    │   └── paiementService.js
    └── tests/
        └── services/           # Tests unitaires Jest
```

---

## Routes principales

| Méthode | Route                              | Rôle requis         | Description                        |
|---------|------------------------------------|---------------------|------------------------------------|
| POST    | `/api/auth/connexion`              | Public              | Connexion, retourne un JWT         |
| GET     | `/api/auth/session`                | Authentifié         | Vérifie la session                 |
| GET     | `/api/utilisateurs`                | ADMIN               | Liste les utilisateurs             |
| POST    | `/api/utilisateurs`                | ADMIN               | Crée un utilisateur                |
| GET     | `/api/clients`                     | MANAGER / AGENT     | Liste les clients                  |
| POST    | `/api/clients`                     | MANAGER / AGENT     | Crée un client                     |
| GET     | `/api/factures`                    | MANAGER / AGENT     | Liste les factures                 |
| POST    | `/api/factures`                    | MANAGER / AGENT     | Crée une facture                   |
| GET     | `/api/factures/client/:clientId`   | MANAGER / AGENT     | Factures d'un client               |
| GET     | `/api/paiements`                   | MANAGER / AGENT     | Liste les paiements                |
| POST    | `/api/paiements`                   | MANAGER / AGENT     | Enregistre un paiement             |
| GET     | `/api/paiements/facture/:id`       | MANAGER / AGENT     | Paiements d'une facture            |

---

## Authentification

Toutes les routes protégées nécessitent un header HTTP :

```
Authorization: Bearer <token>
```

Le token est obtenu via `POST /api/auth/connexion`.

---

## Compte admin par défaut

Au premier démarrage, un compte ADMIN est créé automatiquement :

| Champ    | Valeur                  |
|----------|-------------------------|
| Email    | `admin@recouvra.com`    |
| Mot de passe | `admin123!`         |
