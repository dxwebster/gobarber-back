import { getRepository, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({ where: { date }});
        return findAppointment;
    }

    public async create({ provider_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({ provider_id, date });
        await this.ormRepository.save(appointment);
        return appointment;
    }
}

export default AppointmentsRepository;

// Arquivo responsável por tudo que se refere as operações dos dados de agendamendo (appointments)
// Qualquer função que for ler, criar, listar, buscar, deletar, alterar deve ficar dentro do repositório
// Ponte entre a aplicação a e o banco de dados
