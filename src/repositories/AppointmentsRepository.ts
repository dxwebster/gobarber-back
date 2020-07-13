// Arquivo responsável por tudo que se refere as operações dos dados de agendamendo (appointments)
// Qualquer função que for ler, criar, listar, buscar, deletar, alterar deve ficar dentro do repositório
// Ponte entre a aplicação a e o banco de dados

import Appointment from '../models/Appointment';
import { isEqual } from 'date-fns';

// Data transfer Objetct: transfiro um objeto de um arquivo pro outro
interface CreateAppointmentDTO{
    provider: string;
    date: Date;
}

// Cria o Repositório do Appointments
class AppointmentsRepository{
    private appointments: Appointment[];
    constructor(){
        this.appointments = []; // cria um array de appointments vazio, pois não temos banco de dados
    }

    // listar todos os appointments
    public all(): Appointment[] {
        return this.appointments;
    }

    // lida com as datas
    public findByDate(date: Date): Appointment | null {
        const findAppointment = this.appointments.find(appointment =>
            isEqual(date, appointment.date),
        );
        return findAppointment || null; // retorna o que encontrou ou retorna nulo
    }

    // criação do novo appointment
    public create({ provider, date }: CreateAppointmentDTO): Appointment {
        const appointment = new Appointment({ provider, date }); // criação de um novo appointment seguindo o models/Appointment
        this.appointments.push(appointment); // coloca o novo appointment dentro do array appointments
        return appointment;  // retorna o array de appointments
    }
}

export default AppointmentsRepository;
