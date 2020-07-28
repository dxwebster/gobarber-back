import  { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService{
    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        // Verificar se o id é de usuário válido
        const user =  await usersRepository.findOne(user_id);
        if (!user){
            throw new AppError('Only authenticated users can change avatar.', 401);
        }

        // se antes da atualização o user já tinha um avatar, preciso deletar o avatar anterior
        if (user.avatar) {
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if (userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        // pega o usuário que ja tem id, e atualiza
        user.avatar = avatarFilename;
        await usersRepository.save(user);

        return user;
    }

}

export default UpdateUserAvatarService;
