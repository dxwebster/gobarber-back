// Arquivo responsável por receber uma requisição, chamar outro arquivo para tratar a requisição, devolver uma resposta

import { parseISO } from 'date-fns'; // importa os métodos para lidar com datas
import { Router } from 'express'; // importa as rotas do express
import { getCustomRepository } from 'typeorm'; // importa o custom repository do typeorm

import AppointmentsRepository from '../repositories/AppointmentsRepository'; // importa o repositorio de appointments
import CreateAppointmentService from '../services/CreateAppointmentService'; // importa o service de appointments

import ensureAuthenticated from '../middlewares/ensureAuthenticated'; // importa  a autenticação do JWT token

const appointmentsRouter = Router(); // cria uma variável de rotas

appointmentsRouter.use(ensureAuthenticated); // aplica o middleware em todas as rotas de agendamentos

// Rota que lista os appointments
appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

// Rota que cria novos appointments
appointmentsRouter.post('/', async (request, response) => {
    // faz a rota de método post para criar um novo appointmment
    const { provider_id, date } = request.body; // pega as informações vinda do corpo da requisição

    const parsedDate = parseISO(date); // transformação de dados pode deixar na rota (parseISO: converte string de data com formato date nativo do js)

    const createAppointment = new CreateAppointmentService(); // a regra de negócio fica dentro do service
    const appointment = await createAppointment.execute({
        date: parsedDate,
        provider_id,
    }); // executa o service

    return response.json(appointment); // retorna o appointment

});

export default appointmentsRouter; // exporta a rota
