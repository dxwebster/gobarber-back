## 🔖  Sobre
Essa é a criação das primeiras funcionalidades do back-end da GoBarber, uma aplicação que permite o agendamento de serviços de cabeleireiros.

## 🚀 Tecnologias utilizadas
O projeto foi desenvolvido utilizando as seguintes tecnologias
* NodeJS
* Express
* Typescript
* uuidv4
* Insomnia

## 🗂 Como criar essa aplicação do zero
Abaixo você vai encontrar todas a informações de como criar essa aplicação do zero.
Primeiro passo é instalar o Node: https://nodejs.org/en/

## Instalação das bibliotecas

Criar uma pasta 'primeiro-projeto-node' que vai conter nossa aplicação.

**Iniciar o node na pasta** _(cria o arquivo 'package.json')_: `yarn init -y`

**Instalar o Express** _(cria a pasta 'node_modules' e o arquivo 'package-lock.json')_: `yarn add express -D`

**Instalar a definição de tipos do Express**: `yarn add @types/express -D`

**Instalar o Typescript**: `yarn add typescript -D`

**Iniciar o TSC (TypeScript Compiler)**: _(cria o arquivo 'tsconfig.json')_: `yarn tsc --init`

**Instalar o TS-Node-DEV**: `yarn add ts-node-dev -D`

Criar uma nova pasta 'src'e um arquivo 'server.ts' dentro dessa pasta.

## Configuração do TSC (TypeScript Compiler)
No arquivo 'tsconfig.json', vamos configurar o TSC (TypeScript Compiler), que vai compilador o códgio ts e converter em javascript.
O 'rootDir' será o diretório dos arquivos .ts e 'outDir' será o diretório com os arquivos convertidos em js.

<img src="https://ik.imagekit.io/dxwebster/Screenshot_3_VZXWmS07H.png" />

Apesar do TSC ser essencial para a aplicação, ele não será utilizado no momento de desenvolvimento. Ao invés do TSC, utilizaremos o TS-Node-Dev, uma solução mais rápida que possui muitas funcionalidades como compilação e live Reloader.

## Configuração do TS-Node-DEV
O TS-Node-Dev será usado durante o desenvolvimento da aplicação. Durante a fase de desenvolvimento, o TS-Node-Dev vai compilar nossos arquivos .ts (mesma função do TSC) e também reiniciar o projeto quando o arquivo é modificado (mesma função de um Nodemom por exemplo). (O TS-Node-Dev também permite o uso de decorators, algo que veremos mais pra frente quando começarmos a codar). No arquivo 'package.json', vamos configurar alguns scripts para rodar o TS-Node-Dev e o TSC. 

<img src="https://ik.imagekit.io/dxwebster/Screenshot_6_i6KRRyW3U.png" />

Para iniciar o servidor, executar `yarn dev:server`


## Criação de Rotas de Agendamentos

Criar uma pasta 'routes' e dentro dela vamos criar a primeira rota para agendamento (appointments) de horários no cabeleireiro.
Os arquivos de rotas são responsáveis por receber a requisição, chamar outro arquivo para tratar a requisição, devolver uma resposta e após isso, devolver uma resposta.
Nosso arquivo de rota para agendamentos chamará 'appointments.routes.ts'.

Para lidar com datas e horários, vamos instalar uma dependência chamada Date-fns: `yarn date-fns`. Ela vai converter uma string enviada pelo json, para um  formato date() nativo do javascript.

As primeiras linhas, faremos as importações de dependências:
    
```ts
import { parseISO } from 'date-fns'; // importa os métodos para lidar com datas
import { Router } from 'express'; // importa as rotas do express
import { getCustomRepository } from 'typeorm'; // importa o custom repository do typeorm
```

Logo abaixo, importaremos os arquivos de Repositório e Service que criamos para os agendamentos e a middleware de Autenticação.

```ts
import AppointmentsRepository from '../repositories/AppointmentsRepository'; // importa o repositorio de appointments
import CreateAppointmentService from '../services/CreateAppointmentService'; // importa o service de appointments
import ensureAuthenticated from '../middlewares/ensureAuthenticated'; // importa  a autenticação do JWT token
```

Abaixo, eu crio uma variável que vai conter o método de rotas, para usarmos no código.

```ts
const appointmentsRouter = Router();
```
    
E depois, colocamos o middleware de Autenticação para ser usada em todas as rotas de agendamento seguintes.

```ts
appointmentsRouter.use(ensureAuthenticated); // aplica o middleware em todas as rotas de agendamentos
```

Feito isso, vamos criar duas rotas, a que lista os agendamentos, e a que cria novos agendamentos.

```ts
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
```

E no final, exportamos as rotas

```ts
export default appointmentsRouter; // exporta a rota
```

## Criação do Model do Agendamento

Dentro da pasta 'src' criar uma pasta 'models' e um  arquivo chamado Appointment.ts.
O model ou entidade da aplicação é o lugar que vamos setar o formato de um dado que será armazenado no banco de dados.
Ou seja, nessa aplicação, o model de Appointment é nada mais nada menos que o formato que todo agendamento terá no banco de dados.

As primeiras linhas, vamos importar os métodos do typeorm e [...] 

```ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';

@Entity('appointments') // indica que o model vai ser armazenado dentro da tabela 'appointments'
class Appointment {
   
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider_id: string;

    @ManyToOne(() => User) // muitos agendamentos para um único usuário
    @JoinColumn({ name: 'provider_id' }) // qual a coluna que vai identicar o prestador desse agendamento
    provider: User;

    @Column('timestamp with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

export default Appointment;
```

## Criação do Repositório de Agendamentos

Dentro da pasta src, vamos criar uma pasta 'repositories' e um arquivo 'AppointmentsRepository.ts'.
O Repositório, nessa aplicação, pode ser definido como uma conexão do banco de dados e as rotas de agendamento.
Ele vai guardar as informações dos métodos criar, listar, deletar que faremos sob os agendamentos.

Nas primeiras linhas, vamos importar os métodos do typeorm que vamos utilizar e também o model Appointment que já criamos anteriormente.
Logo abaixo, criaremos o repositório que [...] 

```ts
import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>{
    public async findByDate(date: Date): Promise<Appointment | null> {
        const findAppointment =  await this.findOne({
            where: { date },
        });

        return findAppointment || null; // retorna o que encontrou ou retorna nulo
    }
}

export default AppointmentsRepository;
```

## Criação do Service de Agendamentos
Na pasta 'src' criar uma pasta 'services' e um arquivo 'CreateAppointmentService.ts'.
O service vai armazenar a regra de negócio da aplicação. No caso dessa aplicação, o service 'CreateAppointmentService' se encarregará de verificar se já existe algum agendamento na data selecionada e retornar uma resposta. Caso já tenha, vai retornar um "erro" com a mensagem 'This appointmnet is already booked', caso não tenha, permitirá que o agendamento prossiga e seja salvo no banco de dados.

Nas primeiras linhas, importaremos o Date-fns para lidar com as datas e o método de repositório do typeorm.

```ts
import { startOfHour } from 'date-fns'; // importa os métodos para lidar com datas
import { getCustomRepository } from 'typeorm';
```

Logo abaixo, vamos importar [...], o model e o repositório de Agendamento

```ts
import AppError from '../errors/AppError';
import Appointment from '../models/Appointment'; // importa o model de appointment
import AppointmentsRepository from '../repositories/AppointmentsRepository'; // importa o repositório de appointment
```

Vamos criar um DTO [...]???

```ts
interface RequestDTO {
    provider_id: string;
    date: Date;
}
```
O service é criado por meio de classe por meio do método publico 'execute()', que nesse caso significa a criação de um novo agendamento.
O execute recebe dois parâmetros, a data selecionada e o provider_id que seria o id do cabeleireiro. Dentro do execute, colocaremos a regra de criação do agendamento, ou seja, só pode ocorrer se não houver nenhum outro agendamento no mesmo horário.

```ts
class CreateAppointmentService {
    public async execute({ date, provider_id }: RequestDTO): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date); // startOfHour: formata a hora sem minutos ou segundos //

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate); //verifica se já tem um appointment na mesma data
        if (findAppointmentInSameDate){ // se encontrar o appointment na mesma data de um já existente retorna erro
            throw new AppError('This appointmnet is already booked');
        }

        const appointment = appointmentsRepository.create({ provider_id, date: appointmentDate }); // cria um novo appointment
        await appointmentsRepository.save(appointment); // salva o registro no banco de dados

        return appointment; // retorna o appointment feito
    }
}

export default CreateAppointmentService; // exporta o service de appointment
```


## Criação do banco de dados
Essa é a criação das primeiras funcionalidades do back-end da aplicação GoBarber, um serviço de agendamento de cabeleireiros. Aqui vamos trabalhar na criação do banco de dados.

## 🚀 Tecnologias utilizadas
O banco de dados foi desenvolvido utilizando as seguintes tecnologias
* NodeJS
* Docker
* DBeaver
* Postgres
* WSL2


## Instalação e configuração do Docker
O docker cria ambientes isolados, chamados de containers, onde vamos instalar nosso banco de dados Postgres.
Ele cria subsistemas que não interfere diretamente no funcionamento da nossa máquina.

No Windows Home, o Docker Desktop poderá ser instalado por meio do WSL2 (Windows Subsystem dor Linux), qu permite rodar o linux dentro do windows.
Para instalar o Docker no Windows Home, seguir este tutorial: https://medium.com/@gmusumeci/linux-on-windows-totally-how-to-install-wsl-1-and-wsl-2-307c9dd38a36

## Criação de um conteiner para o Postgres
Já com o Docker instalado, vamos criar um conteiner que vai conter nosso banco de dados Postgres, com as seguintes informações:
- Nome da imagem: gostack_postgres
- Password: docker
- Porta do container: 5432 
- Porta do sistema: 5432 (verificar antes se a porta está disponível)
- Banco de dados: Postgres

Executar `docker run --name gostack_postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

Para verificar se o postgres está executando, basta executar o comando `docker ps`, ou acessar o dashboard do docker, que mostrará seu container criado.

<img src="https://ik.imagekit.io/dxwebster/Screenshot_1_ZIPo2y5F3.png" />

Para iniciar ou encerrar a execução de um container, basta executar os comandos `docker start [nome ou id do container]`ou `docker stop [nome ou id do container]`.
É possível fazer isso também pelo dashboard do Docker Desktop.

## Instalação e Configuração do DBeaver
O DBeaver é uma ferramenta gratuita multiplataforma para acessar o banco de dados. Baixar o DBeaver [aqui](https://dbeaver.io/).

- Ao abrir o software, selecionar PostGreSQL e colocar as informações igual o print abaixo (a senha é a mesma que colocamos quando instalamos o postgre pelo docker). E na aba PostgreSQL, selecionar 'Show all databases'.

<img src="https://ik.imagekit.io/dxwebster/Untitled_ydVAtVIbx.png" />

- Agora vamos criar o banco de dados, conforme os passos a seguir:
<img src="https://ik.imagekit.io/dxwebster/Untitled_BPCJZbc7p.png" width="500" />
<img src="https://ik.imagekit.io/dxwebster/Untitled_ydVAtVIbx.png" width="500" />



Instalação do TypeORM e driver do postgres `yarn add typeorm pg`

Instalação de uma dependência do typescript `yarn add reflect-metadata`

Criar arquivo ormconfig.json

```json
{
    "type": "postgres",
    "host": "192.168.99.100",
    "port": 5432,
    "username": "postgres",
    "password": "docker",
    "database": "gostack_gobarber",
    "entities": [
        "./src/models/*.ts"
    ],
    "migrations":[
        "./src/database/migrations/*.ts"
    ],
    "cli": {
        "migrationsDir":"./src/database/migrations"
    }
 }
```

Criar pasta database com o index.ts que cria a conexão

```tsx
import { createConnection } from 'typeorm'; // procura o arquivo ormconfig.json para encontrar as configurações de conexão com bd

createConnection();
```

No package.json, criar um script para criação das tabelas (migrations)

<img src="https://ik.imagekit.io/dxwebster/Untitled__1__ih3Ecp8vR.png" />

Dentro da pasta database, criar pasta migrations. (As migrations servem como um historico de banco de dados, para manter tudo na  mesma versão. É bom qdo tem vários desenvolvedores.)

Criar tabela CreateAppointments `yarn typeorm migration:create -n CreateAppointments`

Esse comando vai criar um arquivo dentro da pasta migrations. Ela vai criar uma estrutura em que se poderá criar uma tabela (up) e excluir (down) caso for necessário. Vamos criar as colunas da nossa tabela:

```tsx
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateAppointments1594855599794 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'appointments',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name:  'provider',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'date',
                        type: 'timestamp with time zone',
                        isNullable: false,
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('appointments');
    }

}
```

Para criar a tabela no banco de dados: `yarn typeorm migration:run`

O terminal vai exibir as querys que foram executadas.

<img src="https://ik.imagekit.io/dxwebster/Untitled__2__Yg5VpH3Yiq.png" />
