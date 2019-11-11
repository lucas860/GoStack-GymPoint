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

    const cadQuestion = await HelpOrders.create({
      student_id: req.params.student_id,
      question,
    });

    return res.json(cadQuestion);
  }
}

export default new HelpOrdersController();
