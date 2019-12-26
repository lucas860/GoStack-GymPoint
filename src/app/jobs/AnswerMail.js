import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { student, answer } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Sua solicitação foi respondida!',
      template: 'answer',
      context: {
        student: student.name,
        answer,
      },
    });
  }
}

export default new AnswerMail();
