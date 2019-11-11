import { parseISO, addMonths, isBefore, endOfDay } from 'date-fns';

import Student from '../models/Student';
import Plan from '../models/Plan';

import Registration from '../models/Registration';

class RegistrationController {
  async index(req, res) {
    const list = await Registration.findAll({
      attributes: ['id', 'price', 'created_at'],
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

  async update(req, res) {
    const { plan } = req.body;
    const regId = req.params.registration_id;

    const reg = await Registration.findOne({
      where: {
        id: regId,
      },
    });

    if (!reg) {
      return res.status(404).json({ error: 'Invalid registration ID' });
    }

    const getPlan = await Plan.findByPk(plan);
    const fullPrice = getPlan.price * getPlan.duration;

    reg.update({
      plan_id: plan,
      price: fullPrice,
      where: {
        id: regId,
      },
    });

    return res.json(reg);
  }

  async delete(req, res) {
    const findReg = await Registration.findByPk(req.params.registration_id);

    if (!findReg) {
      return res.status(404).json({ error: 'Invalid registration ID' });
    }

    Registration.destroy({
      where: {
        id: req.params.registration_id,
      },
    });

    return res.json(findReg);
  }
}

export default new RegistrationController();
