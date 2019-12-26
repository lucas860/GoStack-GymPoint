import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { title, price, totalPrice, findStudent, registration } = data;

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
        startDate: format(
          parseISO(registration.start_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        endDate: format(
          parseISO(registration.end_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new RegistrationMail();
