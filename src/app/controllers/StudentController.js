import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll();

    return res.json(students);
  }

  async store(req, res) {
    const data = req.body;

    const findStudent = await Student.findOne({ where: { email: data.email } });

    if (findStudent) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const newStudent = await Student.create(req.body);

    return res.json(newStudent);
  }
}

export default new StudentController();
