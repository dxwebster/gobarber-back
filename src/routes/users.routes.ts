import { Router, request } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);



// Rota que cria novo usuário com nome, email e password
usersRouter.post('/', async (request, response) => {

    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return response.json(user);

});

// Rota que faz upload do avatar
usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    // Coloco a migration ensureAuthenticated, pois o usuário apenas pode trocar o avatar se estiver autenticado

    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);

});



export default usersRouter; // exporta as rotas
