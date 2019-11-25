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
    const schema = Yup.object().shape({
      student: Yup.number().required(),
      plan: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student, plan, start_date } = req.body;

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
      // text: `Obrigado por escolher a Gympoint!
      // Abaixo estão as informações da sua matrícula:
      // Nome: ${findStudent.name}
      // Nº da matrícula: ${registration.id}
      // Plano: ${getPlan.title},
      // Valor/Mensal: R$${getPlan.price},
      // Valor/Total: R$${registration.totalPrice},
      // Data de ínicio: ${start_date},
      // Data de término: ${registration.end_date},

      // Seja muito bem vindo!!!

      // Equipe Gympoint
      // `,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({});

    const regId = req.params.registration_id;

    const reg = await Registration.findOne({
      where: {
        id: regId,
      },
      attributes: [
        'id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
        'active',
      ],
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

    await reg.update(req.body, {
      price: reg.plan.price * reg.plan.duration,
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
