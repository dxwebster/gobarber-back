// Arquivo responsável por receber uma requisição, chamar outro arquivo para tratar a requisição, devolver uma resposta

import { parseISO } from 'date-fns'; // importa os métodos para lidar com datas
import { Router } from 'express'; // importa as rotas do express
import AppointmentsRepoository from '../repositories/AppointmentsRepository'; // importa o repositório de appointment
import CreateAppointmentService from '../services/CreateAppointmentService'; // immporta o service de appointment



const appointmentsRouter = Router(); // cria uma variável de rotas
const appointmentsRepository = new AppointmentsRepoository(); // cria um novo repositório


// Rota que lista os appointments
appointmentsRouter.get('/', (request, response) => {
    const appointments = appointmentsRepository.all();
    return response.json (appointments);

});

// Rota que cria novos appointments
appointmentsRouter.post('/', (request, response) => { // faz a rota de método post para criar um novo appointmment
    try {
        const { provider, date } = request.body; // pega as informações vinda do corpo da requisição

        const parsedDate = parseISO(date); // transformação de dados pode deixar na rota (parseISO: converte string de data com formato date nativo do js)

        const CreateAppointment = new CreateAppointmentService(appointmentsRepository); // a regra de negócio fica dentro do service
        const appointment = CreateAppointment.execute({date: parsedDate, provider}); // executa o service

        return response.json(appointment); // retorna o appointment

    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default appointmentsRouter; // exporta a rota
