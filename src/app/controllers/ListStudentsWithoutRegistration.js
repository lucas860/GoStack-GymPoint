import { Op } from 'sequelize';

import Student from '../models/Student';
import Registration from '../models/Registration';

class ListStudentsWithoutRegistration {
  async index(req, res) {
    const { search } = req.query;

    const students = search
      ? await Student.findAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      })
      : await Student.findAll({
        order: [['name', 'ASC']],
      });

    const registrations = await Registration.findAll({
      attributes: ['student_id'],
    });

    const response = students.filter(
      s => !registrations.find(r => r.student_id === s.id)
    );

    return res.json(response);
  }
}

export default new ListStudentsWithoutRegistration();
