const Facture = require('../models/Facture');
const Client = require('../models/Client');

class FactureService {
  async creer(data) {
    const clientExiste = await Client.findById(data.client);
    if (!clientExiste) {
      throw { status: 404, message: "Client introuvable." };
    }

    data.montantRestant = data.montantTotal;
    const facture = new Facture(data);
    await facture.save();
    return facture;
  }

  async listerTous() {
    return await Facture.find().populate('client', 'raisonSociale email');
  }

  async trouverParId(id) {
    const facture = await Facture.findById(id).populate('client', 'raisonSociale email telephone');
    if (!facture) {
      throw { status: 404, message: "Facture non trouvée." };
    }
    return facture;
  }

  async trouverParClient(clientId) {
    return await Facture.find({ client: clientId });
  }

  async mettreAJour(id, data) {
    const facture = await Facture.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!facture) {
      throw { status: 404, message: "Facture non trouvée." };
    }
    return facture;
  }

  async supprimer(id) {
    const facture = await Facture.findByIdAndDelete(id);
    if (!facture) {
      throw { status: 404, message: "Facture non trouvée." };
    }
    return facture;
  }

  async mettreAJourMontantRestant(id, montant) {
    const facture = await Facture.findById(id);
    if (!facture) {
      throw { status: 404, message: "Facture introuvable." };
    }

    if (facture.statut === 'PAYEE') {
      throw { status: 400, message: "Cette facture est déjà entièrement payée." };
    }

    if (montant > facture.montantRestant) {
      throw { status: 400, message: `Le montant dépasse le restant dû (${facture.montantRestant} TND).` };
    }

    facture.montantRestant -= montant;
    facture.statut = facture.montantRestant <= 0 ? 'PAYEE' : 'PAYEE_PARTIELLEMENT';
    /* istanbul ignore next */ // Protection floating point - code défensif
    if (facture.montantRestant < 0) facture.montantRestant = 0;

    await facture.save();
    return facture;
  }
}

module.exports = new FactureService();
