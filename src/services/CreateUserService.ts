import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';


interface Request {
    name: string,
    email: string,
    password: string,

}


class CreateUserService{
    async execute( { name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        // Verifica se já tem um email cadastrado
        const checkUserExists = await usersRepository.findOne({
            where: { email },
        });

        if (checkUserExists) {
            throw new Error('Email address already used');
        }

        // Faz a criptografia da senha
        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({ name, email, password: hashedPassword });// Armazena o objeto criado na variável user
        await usersRepository.save(user); //e salva no banco de dados
        return user; // e retorna o usuário

    }
}

export default CreateUserService;
