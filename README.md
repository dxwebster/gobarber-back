# 🔖  Sobre
Essa é a criação das primeiras funcionalidades do back-end da GoBarber, uma aplicação que permite o agendamento de serviços de cabeleireiros.

# 🚀 Tecnologias utilizadas
O projeto foi desenvolvido utilizando as seguintes tecnologias
* NodeJS
* Express
* Typescript
* Insomnia
* TypeORM
* Docker
* Postgres
* DBeaver
* WSL2

# 🖥 Instalação e Configuração de Softwares

## Docker

O Docker cria ambientes isolados, chamados de containers, onde vamos instalar nosso banco de dados Postgres.
Ele cria subsistemas que não interfere diretamente no funcionamento da nossa máquina.

No Windows Home, o Docker Desktop poderá ser instalado por meio do WSL2 (Windows Subsystem dor Linux), qu permite rodar o linux dentro do windows.
Para instalar o Docker no Windows Home, seguir este tutorial: https://medium.com/@gmusumeci/linux-on-windows-totally-how-to-install-wsl-1-and-wsl-2-307c9dd38a36

## Postgres

Já com o Docker instalado, vamos criar um conteiner que vai conter nosso banco de dados Postgres, com as seguintes informações:
- Nome da imagem: gostack_postgres
- Password: docker
- Porta do container: 5432 
- Porta do sistema: 5432 (verificar antes se a porta está disponível)
- Banco de dados: Postgres

Executar `docker run --name gostack_postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

Para verificar se o postgres está executando, basta executar o comando `docker ps`, ou acessar o dashboard do docker, que mostrará seu container criado.

<img src="https://ik.imagekit.io/dxwebster/Screenshot_1_ZIPo2y5F3.png" width= 550/>

Para iniciar ou encerrar a execução de um container, basta executar os comandos `docker start [nome ou id do container]`ou `docker stop [nome ou id do container]`.
É possível fazer isso também pelo dashboard do Docker.

## DBeaver

O DBeaver é uma ferramenta gratuita multiplataforma para acessar o banco de dados. Baixar o DBeaver [aqui](https://dbeaver.io/).

- Ao abrir o software, selecionar PostGreSQL e colocar as informações igual o print abaixo (a senha é a mesma que colocamos quando instalamos o postgre pelo docker). E na aba PostgreSQL, selecionar 'Show all databases'.

<img src="https://ik.imagekit.io/dxwebster/Untitled_ydVAtVIbx.png"  width= 550/>

- Agora vamos criar o banco de dados, conforme os passos a seguir:

| <img src="https://ik.imagekit.io/dxwebster/Untitled_BPCJZbc7p.png" width="500" /> |  <img src="https://ik.imagekit.io/dxwebster/Untitled_ydVAtVIbx.png" width="500" /> |
|----------|----------|


# 📚 Instalação das bibliotecas
O Node e o Yarn já devem estar instalados. 

Criar uma pasta 'primeiro-projeto-node' que vai conter nossa aplicação.

**Iniciar o node na pasta** _(cria o arquivo 'package.json')_: `yarn init -y`

**Instalar o Express** _(cria a pasta 'node_modules' e o arquivo 'package-lock.json')_: `yarn add express -D`

**Instalar a definição de tipos do Express**: `yarn add @types/express -D`

**Instalar o Typescript**: `yarn add typescript -D`

**Iniciar o TSC (TypeScript Compiler)** _(cria o arquivo 'tsconfig.json')_: `yarn tsc --init`

**Instalar o TS-Node-DEV**: `yarn add ts-node-dev -D`

**Instalação do TypeORM e driver do postgres** `yarn add typeorm pg`

**Instalação de uma dependência do typescript para sintaxe de decorators** `yarn add reflect-metadata`

Criar uma nova pasta 'src'e um arquivo 'server.ts' dentro dessa pasta.


## Configurações do TSC

Uma das principais funcionalidades do TSC é compilar nosso códgio ts e converter em javascript para que a aplicação possa rodar nos navegadores. Apesar disso, ele não será utilizado como compilador no processo de desenvolvimento, mas apenas quando fizermos a build da aplicação. Portanto, vamos configurar outros recursos utilizaremos no processo de desenvolvimento. No arquivo 'tsconfig.json':

Vamos habilitar o "experimentalDecorators" e "emitDecoratorMetadata". Esse recurso permite o uso de decorators quando formos criar os models das entidades.

<img src="https://ik.imagekit.io/dxwebster/Screenshot_4_6A8paM9eZ.png" />

Outra configuração que já podemos adiantar é setar a propriedade "strictPropertyInitialization" como 'false', para evitar um conflito na criação das variáveis nos models.

<img src="https://ik.imagekit.io/dxwebster/Screenshot_3_aEMMCnGho.png" />


## Configuração do TS-Node-DEV

Na fase de desenvolvimento utilizaremos o TS-Node-Dev, uma solução mais rápida que possui muitas funcionalidades que o TSC. O TS-Node-Dev vai compilar nossos arquivos .ts (mesma função do TSC) e também reiniciar o projeto quando o arquivo é modificado (mesma função de um Nodemom por exemplo). No arquivo 'package.json', vamos configurar o script para rodar o servidor pelo TS-Node-Dev e também já vamos aproveitar para criar um script de criação de migrations pelo TypeORM. 

<img src="https://ik.imagekit.io/dxwebster/Screenshot_2_kFcSZaJru.png" />

A partir de agora, para iniciar o servidor, basta executar `yarn dev:server`
E quando formos criar nossas migrations, utilizaremos o comando `yarn typeorm [comandos de migrations]`

## Configurações do TypeORM

Na pasta src, criar uma pasta 'database' e um arquivo index.ts. Esse arquivo será responsável pela nossa conexão com o banco de dados. A única coisa que faremos é importar uma função 'createConnection()' do TypeORM que procura no meu projeto um arquivo 'ormconfig.json' para fazer a conexão com o banco de dados.

```ts
import { createConnection } from 'typeorm'; 

createConnection();
```
Na mesma pasta 'database' vamos criar uma subpasta 'migrations'. As migrations vão servir como um histórico do banco de dados. Agora raiz do projeto, vamos criar arquivo 'ormconfig.json' e colocar as informações que o TypeORM precisa para conectar no banco de dados e já vamos indicar também o caminho da nossa pasta 'migrations'.

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

# ✏ Primeiros códigos

Como nosso aplicativo consiste no cadastro de usuários e agendamentos de um horário com um cabeleireiro (providers), temos então basicamente duas entidades: agendamentos e usuários.

## Entidade: Agendamentos

Vamos começar lidando com os agendamentos. Podemos dividir o desenvolvimento na criação de 5 itens:

1- **Tabela de agendamento:** utilizando o typeorm e as migrations para manter o histórico do banco de dados
2- **Rotas de agendamento:** cria um novo agendamento e lista todos os agendamentos.
3- **Model de agendamento:** teremos o id do provider, qual user está solicitando, a data e horário selecionado, a data de criação e data de atualização do agendamento. 
4- **Repositório de agendamento:** procura no banco de dados agendamentos com a data selecionada e retorna.
5- **Service de agendamento:** que verifica se já existe algum agendamento com a data selecionada e permite ou não o agendamento.


## Criação da Tabela de Agendamento

Nosso banco de dados terá duas tabelas principais: agendamentos e usuários (appointments e users). Vamos criar a primeira migration que vai ser responsável pela criação da tabela de agendamentos no banco de dados. O comando abaixo vai criar o arquivo 'CreateAppointments.ts' na pasta 'migrations'.

`yarn typeorm migration:create -n CreateAppointments` 

Essa migration 'CreateAppointments' terá a seguinte estrutura: u 'up()' para criar a tabela e o 'down(), que exclui essa mesma tabela, caso for necessário. 
Na primeira linha, já temos a importação dos os métodos do TypeORM que permitem a execução da migration e acrescentaremos o método 'Table' para criação da tabela. Em seguida temos n

```ts
import { MigrationInterface, QueryRunner, Table } from "typeorm";

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




### Criação de Rotas de Agendamentos

Criar uma pasta 'routes' e dentro dela vamos criar a primeira rota para agendamento (appointments) de horários no cabeleireiro. Nosso arquivo de rota para agendamentos chamará 'appointments.routes.ts'. Os arquivos de rotas são responsáveis por receber a requisição, chamar outro arquivo para tratar a requisição e após isso devolver uma resposta.

Para lidar com datas e horários, vamos instalar uma dependência chamada date-fns: `yarn date-fns`. Com o método parseISO() o date-fns converte uma string enviada pelo json, para um formato date() nativo do javascript.

As primeiras linhas, faremos as importações de dependências:
    
```ts
import { parseISO } from 'date-fns'; // importa os métodos para lidar com datas
import { Router } from 'express'; // importa as rotas do express
import { getCustomRepository } from 'typeorm'; // importa o custom repository do typeorm
```

Logo abaixo, importaremos os arquivos de Repositório e Service que criamos para os agendamentos e a middleware de Autenticação.

```ts
import AppointmentsRepository from '../repositories/AppointmentsRepository'; // importa o Repositorio de appointments
import CreateAppointmentService from '../services/CreateAppointmentService'; // importa o Service de appointments
import ensureAuthenticated from '../middlewares/ensureAuthenticated'; // importa  a Autenticação do JWT token
```
Depois armazenamos em uma variável o método de rotas e incluímos o middleware de autenticação que será usada em todas as rotas de agendamento seguintes.

```ts
const appointmentsRouter = Router(); // variável que vai conter o método de rotas
appointmentsRouter.use(ensureAuthenticated); //  middleware de autenticação 
```

Feito isso, vamos criar duas rotas, a que lista os agendamentos, e a que cria novos agendamentos. Na rota de criação de agendamentos, utilizaremos o método parseISO que apenas transforma os dados, por isso, não há problema em deixa-lo aqui dentro da rota.

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

    const parsedDate = parseISO(date); // transformação de dados pode deixar na rota

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

### Criação do Model do Agendamento

Dentro da pasta 'src' criar uma pasta 'models' e um  arquivo chamado Appointment.ts.
O model ou entidade da aplicação é o lugar que vamos setar o formato de um dado que será armazenado no banco de dados.
Ou seja, nessa aplicação, o model de Appointment é nada mais nada menos que o formato que todo agendamento terá no banco de dados.

As primeiras linhas, vamos importar os métodos do typeorm que informam que essa model está relacionada a uma tabela do banco de dados. Depois logo abaixo, vamos informar os formato de cada coluna da tabela 'appointments'.

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

### Criação do Repositório de Agendamentos

Dentro da pasta src, vamos criar uma pasta 'repositories' e um arquivo 'AppointmentsRepository.ts'.
O Repositório, nessa aplicação, pode ser definido como uma conexão do banco de dados e as rotas de agendamento. Com a utilização do TypeORM, já temos alguns métodos padrão que usamos para manipular o banco de dados, como por exemplo: 'create()', 'list()', 'remove()', 'update()', entre outros (consultar métodos de Repository). Entretanto, podemos criar nosso próprios métodos para atender às necessidades da nossa aplicação.  Na nossa aplicação, além de criar, listar ou remover agendamentos, precisamos de um método que possa encontrar no banco de dados um agendamento pela data. Assim, criaremos o método findByDate(). 

Nas primeiras linhas, vamos importar os métodos do typeorm que vamos utilizar e também o model Appointment que já criamos anteriormente.
Logo abaixo, criaremos o repositório com nosso novo método 'findByDate()'.

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

### Criação do Service de Agendamentos

Na pasta 'src' criar uma pasta 'services' e um arquivo 'CreateAppointmentService.ts'. O service vai armazenar a regra de negócio da aplicação. No caso dessa aplicação, o service 'CreateAppointmentService' se encarregará de verificar se já existe algum agendamento na data selecionada e retornar uma resposta. Caso já tenha, vai retornar um "erro" com a mensagem 'This appointmnet is already booked', caso não tenha, permitirá que o agendamento prossiga e seja salvo no banco de dados.

Nas primeiras linhas, importaremos o 'date-fns' para lidar com as datas e o método de repositório do typeorm. O método 'startOfHour()' formata a hora para deixar sem minutos ou segundos.

```ts
import { startOfHour } from 'date-fns'; // importa os métodos para lidar com datas
import { getCustomRepository } from 'typeorm'; // importa o método de repositório customizado
```

Logo abaixo, vamos importar [...], o model e o repositório de Agendamentos.

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
O service é criado por meio de classe por meio do método publico 'execute()', que nesse caso significa a criação de um novo agendamento. O 'execute()' recebe dois parâmetros, a 'data selecionada' e o 'provider_id'. Dentro do execute, colocaremos a regra de criação do agendamento, ou seja, só pode ocorrer um  novo agendamento se não houver nenhum outro agendamento no mesmo horário. E para isso, utilizaremos nosso método 'findByDate()' criado no 'AppointmentsRepository'.

```ts
class CreateAppointmentService {
    public async execute({ date, provider_id }: RequestDTO): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date); 

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



## Entidade: Usuários

Agora, criaremos tudo relacionado a entidade usuários, criando:

- **Tabela de usuários:** utilizando o typeorm e as migrations para manter o histórico do banco de dados
- **Rotas de usuários:** cria um novo usuário e permite o upload de um avatar.
- **Model de usuários:** teremos o id do user, seu nome, seu email, seu password, o avatar, a data de criação e data de atualização do agendamento. 
- **Repositório de usuários:** ????
- **Service de usuários:** ????







### 1. Criação de Rotas de Usuários

### 2. Criação do Model do Usuários

Para a model do usuário, dentro da pasta 'models' vamos criar um  arquivo chamado User.ts. Nessa aplicação, o model de User é nada mais nada menos que o formato que todo user terá no banco de dados. Através do @Entity('users') eu indico que ele será armazenado na tabela users do banco de dados. Da mesma forma que nos agendamentos, vamos importar nas primeiras linhas os métodos do typeorm e depois, informar os formato de cada coluna da tabela.

```ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // indica que o model vai ser armazenado dentro da tabela 'users'
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default User;
```


### 3. Criação do Repositório de Usuários


### 4. Criação do Service de Usuários






















