import Plan from '../models/Plan';

class GetOnePlan {
  async index(req, res) {
    const { plan_id } = req.params;

    const plan = await Plan.findByPk(plan_id);

    return res.json(plan);
  }
}

export default new GetOnePlan();
