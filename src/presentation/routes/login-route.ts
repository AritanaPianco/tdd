import type { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { LoginController } from '../controllers/login-controller';

export async function loginRoute(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
    const loginController = container.resolve(LoginController);
    const customRequest = {
      body: {
        email,
        password,
      },
    };
    console.log(request.headers);
    const response = await loginController.handle(customRequest);
    reply.status(response.statusCode).send(response.body);
  });
}
