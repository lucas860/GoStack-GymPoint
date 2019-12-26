import { subDays } from 'date-fns';

import Checkin from '../schemas/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.find({
      student_id: req.params.student_id,
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { student_id } = req.params;

    const findStudent = await Student.findByPk(student_id);

    if (!findStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const checkins = await Checkin.find({
      createdAt: { $gte: subDays(new Date(), 7), $lt: new Date() },
    });

    if (checkins.length >= 5) {
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
