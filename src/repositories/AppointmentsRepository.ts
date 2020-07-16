// Arquivo responsável por tudo que se refere as operações dos dados de agendamendo (appointments)
// Qualquer função que for ler, criar, listar, buscar, deletar, alterar deve ficar dentro do repositório
// Ponte entre a aplicação a e o banco de dados

import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>{
    public async findByDate(date: Date): Promise<Appointment | null> {
        const findAppointment =  await this.findOne({
            where: { date },
        });

        return findAppointment || null; // retorna o que encontrou ou retorna nulo
    }
}

export default AppointmentsRepository;
