<p align=center>

<h5 align=center>
<img src="https://github.com/dxwebster/GoBarber-Frontend/blob/master/readme/Capa.png" width=600><br>

🎨 Design por [Tiago Luchtenberg](https://www.instagram.com/tiagoluchtenberg/)

</h5>

</p>

---

## 🔖 Sobre

Essa é o back-end da GoBarber, uma aplicação que permite o agendamento de serviços de cabeleireiros.

## 📥 Executar esse projeto no seu computador

- Clonar Repositório: `git clone https://github.com/dxwebster/GoBarber-API.git`
- Ir para a pasta: `cd GoBarber-API`
- Instalar dependências: `yarn install`
- Executar o docker: `docker start gostack_postgres`
- Rodar Aplicação: `yarn dev:server`

## 🛠 Como criar esse projeto do zero

1. [Ambiente de Desenvolvimento](https://github.com/dxwebster/GoBarber-Backend/wiki/1.-Ambiente-de-Desenvolvimento)
2. [Instalação e Configuração das Bibliotecas](https://github.com/dxwebster/GoBarber-Backend/wiki/2.-Instala%C3%A7%C3%A3o-e-Configura%C3%A7%C3%A3o-das-Bibliotecas)
3. [Entidade: Agendamentos](https://github.com/dxwebster/GoBarber-Backend/wiki/3.-Entidade:-Agendamentos)
4. [Entidade: Usuários](https://github.com/dxwebster/GoBarber-Backend/wiki/4.-Entidade:-Usu%C3%A1rios)

# 🚀 Tecnologias utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias

- NodeJS
- Express
- Typescript
- Insomnia
- TypeORM
- Docker
- Postgres
- DBeaver
- WSL2

# Mapeamento de Features do sistema

## Recuperação de senha

**Requisitos Funcionais**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**Requisitos Não-Funcionais**

- Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**Regras de Negócio**

- O link enviado por email para resetar senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

## Atualização do perfil

**Requisitos Funcionais**

- O usuário deve poder atualizar seu nome, email e senha;

**Regras de Negócio**

- O usuário não pode alterar seu email para um email já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

## Painel do prestador

**Requisitos Funcionais**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**Requisitos Não-Funcionais**

- O agendamentos do prestador do dia devem ser agendados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io

**Regras de Negócio**

- A notificação deve ter um status de lida ou não-lida

## Agendamento de serviços

**Requisitos Funcionais**

- O usuário deve poder listar todos prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês pelo menos um horário disponível de um prestador de serviço;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário debe poder realizar um novo agendamento de um prestador de serviço;

**Requisitos Não-Funcionais**

- A listagem de prestadores deve ser armazenada em cache;

**Regras de Negócio**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h)/
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;

## 📕 Licença

Todos os arquivos incluídos aqui, incluindo este _Readme_, estão sob [Licença MIT](./LICENSE).<br>
Criado com ❤ por [Adriana Lima](https://github.com/dxwebster)
