import { parseISO, addMonths, isBefore, endOfDay, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import * as Yup from 'yup';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

import Mail from '../../lib/mail';

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

    const { title, price, duration } = getPlan;

    const totalPrice = price * duration;

    if (isBefore(parseISO(date), new Date())) {
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

    await Mail.sendMail({
      to: `${findStudent.name} <${findStudent.email}>`,
      subject: 'Matrícula Gympoint',
      template: 'registration',
      context: {
        registration: registration.id,
        student: findStudent.name,
        plan: title,
        value: price,
        totalValue: totalPrice,
        startDate: format(registration.start_date, "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        endDate: format(registration.end_date, "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
      },
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
