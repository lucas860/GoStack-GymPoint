import Registration from '../models/Registration';

class GetOneRegistration {
  async index(req, res) {
    const { registration_id } = req.params;

    const registration = await Registration.findByPk(registration_id);

    return res.json(registration);
  }
}

export default new GetOneRegistration();
