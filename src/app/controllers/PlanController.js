import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: [['price', 'ASC']],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const checkPlanExist = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (checkPlanExist) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { plan_id } = req.params;
    const { title, duration, price } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    await plan.update({
      title,
      duration,
      price,
    });

    return res.json(plan);
  }

  async delete(req, res) {
    const { plan_id } = req.params;

    const plan = await Plan.findByPk(plan_id);

    await plan.destroy();

    return res.json({
      message: `The plan ${plan.title} was succesfully deleted!`,
    });
  }
}

export default new PlanController();
