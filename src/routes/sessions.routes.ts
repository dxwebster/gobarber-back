import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserSevice';

const sessionsRouter = Router();

// Rota que cria novo usuário
sessionsRouter.post('/', async (request, response) => {
    try {
        const { email, password } = request.body;

        const authenticateUser = new AuthenticateUserService();

        const { user, token } = await authenticateUser.execute({
            email,
            password,
        });

        delete user.password; // é bom nunca retornar o password do user

        return response.json({ user, token });
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default sessionsRouter; // exporta a rota
