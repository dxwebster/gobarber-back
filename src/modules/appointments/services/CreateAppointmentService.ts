import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(@inject('AppointmentsRepository') private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date); // startOfHour: formata a hora sem minutos ou segundos

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);
    if (findAppointmentInSameDate) {
      throw new AppError('This appointmnet is already booked');
    }

    const appointment = await this.appointmentsRepository.create({ provider_id, date: appointmentDate });
    return appointment;
  }
}

export default CreateAppointmentService;

// Arquivo que lida com as regras de negócio
