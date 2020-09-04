import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController =  new SessionsController();

sessionsRouter.post('/', sessionsController.create); // Rota que cria uma nova sessão de usuário

export default sessionsRouter;
