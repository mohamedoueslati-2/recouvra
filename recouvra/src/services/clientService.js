const Client = require('../models/Client');

class ClientService {
  async creer(data) {
    const clientExistant = await Client.findOne({ email: data.email });
    if (clientExistant) {
      throw { status: 400, message: "Cet email est déjà utilisé." };
    }
    const client = new Client(data);
    await client.save();
    return client;
  }

  async listerTous() {
    return await Client.find();
  }

  async trouverParId(id) {
    const client = await Client.findById(id);
    if (!client) {
      throw { status: 404, message: "Client non trouvé." };
    }
    return client;
  }

  async mettreAJour(id, data) {
    const client = await Client.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!client) {
      throw { status: 404, message: "Client non trouvé." };
    }
    return client;
  }

  async supprimer(id) {
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      throw { status: 404, message: "Client non trouvé." };
    }
    return client;
  }
}

module.exports = new ClientService();
