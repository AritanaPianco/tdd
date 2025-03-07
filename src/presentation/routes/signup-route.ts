import type { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { SignUpController } from '../controllers/signup-controller';

const schema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['name', 'email', 'password'],
  },
};

export async function SignUpRoute(app: FastifyInstance) {
  app.post('/signup', { schema }, async (request, reply) => {
    const { name, email, password } = request.body as {
      name: string;
      email: string;
      password: string;
    };
    const signupController = container.resolve(SignUpController);
    const customRequest = {
      body: {
        name,
        email,
        password,
      },
    };
    const response = await signupController.handle(customRequest);
    reply.status(response.statusCode).send(response.body);
  });
}
