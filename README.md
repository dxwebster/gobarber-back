## 🔖  Sobre
Essa é a criação das primeiras funcionalidades do back-end da aplicação GoBarber, um serviço de agendamento de cabeleireiros. Aqui vamos trabalhar na criação do banco de dados.

## 🚀 Tecnologias utilizadas
O banco de dados foi desenvolvido utilizando as seguintes tecnologias
* NodeJS
* Express
* uuidv4
* Docker
* DBeaver
* Postgres
* WSL2

## 🗂 Como criar essa aplicação do zero
Pré-requesitos para criar esse banco de dados do zero:
- Node Instalado ([https://nodejs.org/en/])

## Instalação do Docker
O docker cria ambientes isolados, chamados de containers, onde vamos instalar nosso banco de dados Postgres.
Ele cria subsistemas que não interfere diretamente no funcionamento da nossa máquina.

O Docker poderá ser instalado por meio do WSL2 (Windows Subsystem dor Linux), qu epermite rodar o linux dentro do windows.
Para instalar o Docker, seguir este tutorial: https://medium.com/@gmusumeci/linux-on-windows-totally-how-to-install-wsl-1-and-wsl-2-307c9dd38a36

## Criação de um conteiner par ao Posgres
Já com o Docker instalado, vamos criar um conteiner que vai conter nosso banco de dados Postgres, com as seguintes informações:
Nome da imagem: gostack_postgres
Password: docker
Porta do container: 5432 
Porta do sistema: 5432 (verificar antes se a porta está disponível)
Banco de dados: Postgres

Executar `docker run --name gostack_postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

O comando acima significa que v

# Primeiros passos do BD GoBarber

Criar uma database no Dbeaver

<img src="https://ik.imagekit.io/dxwebster/Untitled_BPCJZbc7p.png" />

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
