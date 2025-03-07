import type { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { authMiddlewareAdapter } from '../adapters/auth-middleware-adapter';
import { FetchUsersController } from '../controllers/fetch-users-controller';

export async function FetchUsersRoute(app: FastifyInstance) {
  app.get(
    '/users',
    { preHandler: authMiddlewareAdapter },
    async (request, reply) => {
      const fetchUsersController = container.resolve(FetchUsersController);
      const response = await fetchUsersController.handle({});
      reply.status(200).send(response.body);
    },
  );
}
