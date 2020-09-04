import { Router } from "express";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController =  new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);


// appointmentsRouter.get("/"}); // Rota que lista os appointments
appointmentsRouter.post("/", appointmentsController.create); // Rota que cria novos appointments

export default appointmentsRouter;

