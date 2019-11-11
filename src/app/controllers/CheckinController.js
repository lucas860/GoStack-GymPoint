import { startOfWeek, endOfWeek } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.student_id,
      },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { student_id } = req.params;

    const findStudent = await Student.findByPk(student_id);

    if (!findStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const weekStart = startOfWeek(new Date(), {
      locale: pt,
    });

    const weekEnd = endOfWeek(weekStart, {
      locale: pt,
    });

    const checkins = await Checkin.findAndCountAll({
      where: {
        created_at: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
    });

    if (checkins.count >= 5) {
      return res
        .status(401)
        .json({ error: 'You achieved the semanal checkin limit' });
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
