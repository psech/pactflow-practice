import {
  InteractionObject,
  Pact,
  PactOptions,
  Publisher,
} from '@pact-foundation/pact';
import { PublisherOptions } from '@pact-foundation/pact-node';
import { like, regex } from '@pact-foundation/pact/src/dsl/matchers';

import { ITodo } from '../../api/type';
import { API } from '../../api/api';

const opts: PublisherOptions = {
  pactBroker: process.env.PACT_BROKER_BASE_URL || '',
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  consumerVersion: '0.1.2',
  pactFilesOrDirs: ['./pacts'],
};

new Publisher(opts).publishPacts();

const pactOptions: PactOptions = {
  consumer: 'qa-ct-frontend',
  provider: 'qa-ct-backend',
};
const mockProvider: Pact = new Pact(pactOptions);

describe('Pact with TODO API', () => {
  beforeAll(() => mockProvider.setup());
  afterEach(() => mockProvider.verify());
  afterAll(() => mockProvider.finalize());

  const defaultTodo: ITodo = {
    id: 100,
    completed: false,
    text: 'A todo task 1',
  };
  const getMockTodo = (override?: Partial<ITodo>) => ({
    ...defaultTodo,
    ...override,
  });

  describe('given there are todos', () => {
    describe('when a GET /api/TodoItems call to the API is made', () => {
      it('todos exists', async () => {
        // Arrange
        const expectedTodos: ITodo[] = [
          getMockTodo(),
          getMockTodo({
            id: 101,
            completed: true,
            text: 'A todo task 2',
          }),
        ];

        const interactionObject: InteractionObject = {
          state: 'todos exists',
          uponReceiving: 'a request to get todos',
          withRequest: {
            method: 'GET',
            path: '/api/TodoItems',
          },
          willRespondWith: {
            status: 200,
            body: like(expectedTodos),
            headers: {
              'Content-Type': regex({
                generate: 'application/json; charset=utf-8',
                matcher: 'application/json;?.*',
              }),
            },
          },
        };

        await mockProvider.addInteraction(interactionObject);

        // Act
        const api = new API(`${mockProvider.mockService.baseUrl}/api`);
        const todos = await api.getTodos();

        // Assert
        expect(todos).toStrictEqual(expectedTodos);
      });
    });
  });

  describe('given the todo ID 102 exists', () => {
    describe('when a GET /api/TodoItems/102 call to the API is made', () => {
      it('todos ID 102 exists', async () => {
        // Arrange
        const expectedTodo: ITodo = getMockTodo({ id: 102 });

        const interactionObject: InteractionObject = {
          state: 'todo id=102 exists',
          uponReceiving: 'a request to get todo id=102',
          withRequest: {
            method: 'GET',
            path: '/api/TodoItems/102',
          },
          willRespondWith: {
            status: 200,
            body: like(expectedTodo),
            headers: {
              'Content-Type': regex({
                generate: 'application/json; charset=utf-8',
                matcher: 'application/json;?.*',
              }),
            },
          },
        };

        await mockProvider.addInteraction(interactionObject);

        // Act
        const api = new API(`${mockProvider.mockService.baseUrl}/api`);
        const todo = await api.getTodo(102);

        // Assert
        expect(todo).toStrictEqual(expectedTodo);
      });
    });
  });
});
