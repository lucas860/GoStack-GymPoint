import { parseISO, addMonths, isBefore, endOfDay } from 'date-fns';

import Student from '../models/Student';
import Plan from '../models/Plan';

import Registration from '../models/Registration';

class RegistrationController {
  async index(req, res) {
    const list = await Registration.findAll({
      attributes: ['id', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    return res.json(list);
  }

  async store(req, res) {
    const { student, plan, start_date } = req.body;

    const findStudent = await Student.findByPk(student);

    if (!findStudent) {
      return res.status(400).json({ error: 'The student was not found' });
    }

    const getPlan = await Plan.findByPk(plan);

    if (!getPlan) {
      return res.status(400).json({ error: "The selected plan doesn't exist" });
    }

    const { price, duration } = getPlan;

    const totalPrice = price * duration;

    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const endDate = addMonths(parseISO(start_date), duration);

    const registration = await Registration.create({
      student_id: student,
      plan_id: plan,
      start_date,
      end_date: endOfDay(endDate),
      price: totalPrice,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
