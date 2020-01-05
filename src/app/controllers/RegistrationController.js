import { parseISO, addMonths, isBefore, endOfDay } from 'date-fns';
import * as Yup from 'yup';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const list = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(list);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student: Yup.number().required(),
      plan: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student, plan, date } = req.body;

    const findStudent = await Student.findByPk(student);

    if (!findStudent) {
      return res.status(400).json({ error: 'The student was not found' });
    }

    const getPlan = await Plan.findByPk(plan);

    if (!getPlan) {
      return res.status(400).json({ error: "The selected plan doesn't exist" });
    }

    const findRegistration = await Registration.findOne({
      where: {
        student_id: student,
      },
    });

    if (findRegistration) {
      return res
        .status(400)
        .json({ error: 'This student already has a registration' });
    }

    const { title, price, duration } = getPlan;

    const totalPrice = price * duration;

    if (isBefore(parseISO(date), new Date('0000-00-00'))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const endDate = addMonths(parseISO(date), duration);

    const registration = await Registration.create({
      student_id: student,
      plan_id: plan,
      start_date: date,
      end_date: endOfDay(endDate),
      price: totalPrice,
    });

    await Queue.add(RegistrationMail.key, {
      title,
      price,
      totalPrice,
      findStudent,
      registration,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student: Yup.number().integer(),
      plan: Yup.number().integer(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Validation fails');
    }

    const { student, plan, date } = req.body;
    const regId = req.params.registration_id;

    const reg = await Registration.findByPk(regId);

    const planPrice = await Plan.findByPk(plan);

    await reg.update({
      student_id: student,
      plan_id: plan,
      start_date: date,
      price: planPrice.price * planPrice.duration,
    });

    return res.json(reg);
  }

  async delete(req, res) {
    const { registration_id } = req.params;

    await Registration.destroy({
      where: {
        id: registration_id,
      },
    });

    return res.json({
      message: `The registration ${registration_id} was successfully deleted!`,
    });
  }
}

export default new RegistrationController();
