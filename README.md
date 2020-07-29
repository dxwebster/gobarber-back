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


## Criação de Rota de Agendamento

Criar uma pasta 'routes' e dentro dela vamos criar a primeira rota para agendamento (appointments) de horários no cabeleireiro.
Os arquivos de todas são responsáveis por receber a requisição, chamar outro arquivo para tratar a requisição, devolver uma resposta e após isso, devolver uma resposta.
Nosso arquivo de rota para agendamentos chamará 'appointments.routes.ts'.

As primeiras linhas, faremos as importações de dependências:
    
    ```ts
    import { parseISO } from 'date-fns'; // importa os métodos para lidar com datas
    import { Router } from 'express'; // importa as rotas do express
    import { getCustomRepository } from 'typeorm'; // importa o custom repository do typeorm

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
