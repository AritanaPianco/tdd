import type { FastifyInstance } from 'fastify';
import { makeLoginControllerFactory } from '../factories/login-controller/login-controller-factory';

const schema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['email', 'password'],
  },
};

export async function loginRoute(app: FastifyInstance) {
  app.post('/login', { schema }, async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
    const loginController = makeLoginControllerFactory();
    const customRequest = {
      body: {
        email,
        password,
      },
    };
    const response = await loginController.handle(customRequest);
    reply.status(response.statusCode).send(response.body);
  });
}
