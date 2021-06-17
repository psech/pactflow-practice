# Contract test challenge

## Client - consumer

Based on [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)

### Prerequisites

1. [Node.js](https://nodejs.org/en/) v14 installed, if you use [nvm](https://github.com/nvm-sh/nvm) you may execute `nvm use` to read the version from `qa-ct-frontend/.nvmrc`

### Usage

1. Make a copy of `qa-ct-frontend/.env.sample` and rename to `.env`
1. Provide `PACT_BROKER_BASE_URL` and `PACT_BROKER_TOKEN` values
   ```
   PACT_BROKER_BASE_URL=https://<your-pactflow-domain>.pactflow.io
   PACT_BROKER_TOKEN=<see https://domain-test.pactflow.io/settings/api-tokens for a token>
   ```
1. Execute `make start`

As a result you default broser should pop up and present Todo application at http://localhost:3000/

### Run tests

1. All tests with `npm test`
1. Consumer contract tests with `npm run test:pact`

## Server - provider

Based on [ASP.NET Core 5.0](https://dotnet.microsoft.com/)

### Prerequisites

1. [Dotnet Core 3.1](https://dotnet.microsoft.com/download/dotnet/3.1) installed

### Usage

1. Make a copy of `qa-ct-backend/Todo.ContractTests/.env.sample` and rename to `.env`
1. Provide `PACT_BROKER_BASE_URL` and `PACT_BROKER_TOKEN` values
   ```
   PACT_BROKER_BASE_URL=https://<your-pactflow-domain>.pactflow.io
   PACT_BROKER_TOKEN=<see https://domain-test.pactflow.io/settings/api-tokens for a token>
   ```
1. Execute `npm start`

As a result you should be able to hit

1. Swagger documentation at https://localhost:5001/swagger/index.html
1. API at https://localhost:5001/, e.g. https://localhost:5001/api/TodoItems

### Run tests

1. All tests with `make test`
1. Provider contract tests with `make test-pact`
