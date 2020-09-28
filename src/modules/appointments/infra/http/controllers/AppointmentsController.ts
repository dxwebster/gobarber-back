import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id; // pega o user logado
    const { provider_id, date } = request.body; // pega as informações vinda do corpo da requisição

    const createAppointment = container.resolve(CreateAppointmentService); // pega  o service de criação de agendamento

    const appointment = await createAppointment.execute({ date, provider_id, user_id }); // executa o service de criação de agendamento
    return response.json(appointment); // retorna o appointment
  }
}
