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
    const { question } = req.body;

    if (question === null || question === '') {
      return res
        .status(400)
        .json({ error: 'The question input should be filled' });
    }

    const helpQuestion = await HelpOrders.create({
      student_id: req.params.student_id,
      question,
    });

    return res.json(helpQuestion);
  }
}

export default new HelpOrdersController();
