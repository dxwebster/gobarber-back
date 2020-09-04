import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findByID(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne(id);
        return user;
    };

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({where: {email}});
        return user;
    };

    public async create(userData: ICreateUserDTO): Promise<User> {
        const appointment = this.ormRepository.create(userData);
        await this.ormRepository.save(appointment);
        return appointment;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    };
}

export default UsersRepository;

// Arquivo responsável por tudo que se refere as operações dos dados de agendamendo (appointments)
// Qualquer função que for ler, criar, listar, buscar, deletar, alterar deve ficar dentro do repositório
// Ponte entre a aplicação a e o banco de dados
