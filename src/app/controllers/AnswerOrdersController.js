import * as Yup from 'yup';

import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class AnswerOrdersController {
  async index(req, res) {
    const helpOrders = await HelpOrders.findAll({
      attributes: ['id', 'question'],
      where: {
        answer: null,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'The question input should be filled' });
    }

    const { help_id } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrders.findByPk(help_id);

    await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    const student = await Student.findByPk(helpOrder.student_id);

    await Queue.add(AnswerMail.key, {
      student,
      answer,
    });

    return res.json(helpOrder);
  }
}

export default new AnswerOrdersController();
