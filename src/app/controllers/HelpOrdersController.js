import * as Yup from 'yup';

import HelpOrders from '../models/HelpOrders';

class HelpOrdersController {
  async index(req, res) {
    const list = await HelpOrders.findAll({
      where: {
        student_id: req.params.student_id,
      },
    });

    return res.json(list);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'The question input should be filled' });
    }

    const helpQuestion = await HelpOrders.create({
      student_id: req.params.student_id,
      question: req.body.question,
    });

    return res.json(helpQuestion);
  }
}

export default new HelpOrdersController();
