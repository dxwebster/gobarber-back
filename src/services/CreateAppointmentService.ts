// Arquivo que lida com as regras de negócio

import { startOfHour } from 'date-fns'; // importa os métodos para lidar com datas
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment'; // importa o model de appointment
import AppointmentsRepository from '../repositories/AppointmentsRepository'; // importa o repositório de appointment

interface RequestDTO {
    provider: string;
    date: Date;
}


class CreateAppointmentService {
    public async execute({ date, provider }: RequestDTO): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date); // startOfHour: formata a hora sem minutos ou segundos //

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate); //verifica se já tem um appointment na mesma data
        if (findAppointmentInSameDate){ // se encontrar o appointment na mesma data de um já existente retorna erro
            throw  Error('This appointmnet is already booked');
        }

        const appointment = appointmentsRepository.create({ provider, date: appointmentDate }); // cria um novo appointment
        await appointmentsRepository.save(appointment); // salva o registro no banco de dados

        return appointment; // retorna o appointment feito
    }
}

export default CreateAppointmentService; // exporta o service de appointment
