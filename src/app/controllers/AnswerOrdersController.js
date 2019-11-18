import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

import Mail from '../../lib/mail';

class AnswerOrdersController {
  async index(req, res) {
    const helpOrders = await HelpOrders.findAll({
      where: {
        answer: null,
      },
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { help_id } = req.params;
    const { answer } = req.body;

    if (answer === null || answer === '') {
      return res
        .status(400)
        .json({ error: 'The answer input should be filled' });
    }

    const helpOrders = await HelpOrders.findByPk(help_id);
    const studentOrder = await Student.findByPk(helpOrders.student_id);

    helpOrders.update({
      answer,
      answer_at: new Date(),
    });

    await Mail.sendMail({
      to: `${studentOrder.name} <${studentOrder.email}>`,
      subject: 'Sua solicitação foi respondida',
      template: 'answer',
      context: {
        student: studentOrder.name,
        answer,
      },
    });

    return res.json(studentOrder);
  }
}

export default new AnswerOrdersController();
