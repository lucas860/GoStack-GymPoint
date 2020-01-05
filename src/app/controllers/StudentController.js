import { Op } from 'sequelize';
import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
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

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const findStudent = await Student.findOne({ where: { email } });

    if (findStudent) {
      return res.status(400).json({
        error: 'Another student is registered with this email address already',
      });
    }

    const newStudent = await Student.create(req.body);

    return res.json(newStudent);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      idade: Yup.number(),
      peso: Yup.number(),
      altura: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;
    const { email } = req.body;

    const student = await Student.findByPk(student_id);

    if (email !== student.email) {
      const existEmail = await Student.findOne({ where: { email } });
      if (existEmail) {
        return res.status(400).json({
          error:
            'Another student is registered with this email address already',
        });
      }
    }

    await student.update(req.body);

    return res.json(student);
  }

  async delete(req, res) {
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    student.destroy();

    return res.json(student);
  }
}

export default new StudentController();
