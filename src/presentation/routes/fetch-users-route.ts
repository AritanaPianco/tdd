import type { FastifyInstance } from 'fastify';
import { authMiddlewareAdapter } from '../adapters/auth-middleware-adapter';

import { makeFetchUsersControllerFactory } from '../factories/login-controller/fetch-users-controller-factory';

export async function FetchUsersRoute(app: FastifyInstance) {
  app.get(
    '/users',
    { preHandler: authMiddlewareAdapter },
    async (request, reply) => {
      const fetchUsersController = makeFetchUsersControllerFactory();
      const response = await fetchUsersController.handle({});
      reply.status(200).send(response.body);
    },
  );
}
