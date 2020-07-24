import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService{
    public async execute ({ email, password } : Request) : Promise<Response> {
        // verficar se é um usuário válido
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({ where : { email } });
        if  (!user) {
            throw new Error('Incorrect email/password combination');
        }

        // user.password = senha já gravada no banco de dados (criptografada )
        // password = senha que o user colocou para logar (não criptografada)

        const passwordMatched = await compare(password, user.password); // compare é um método do bcryptjs que compara uma senha não criptografada com uma senha criptografada
        if (!passwordMatched){
            throw new Error('Incorrect email/password combination');
        }

        const token = sign({  }, '91802ea8b9a3b5a75c70c93d84410186', {
            subject: user.id,
            expiresIn: '1d',
        });

        //usuário autenticado
        return {
            user,
            token,
        }

    }
}

export default AuthenticateUserService;
