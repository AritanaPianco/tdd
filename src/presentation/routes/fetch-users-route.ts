import type { FastifyInstance } from 'fastify';
import { authMiddlewareAdapter } from '../adapters/auth-middleware-adapter';
import { makeFetchUsersUseCaseFactory } from '../factories/usecases/fetch-users-usecase-factory';

export async function FetchUsersRoute(app: FastifyInstance) {
  app.get(
    '/users',
    { preHandler: authMiddlewareAdapter },
    async (request, reply) => {
      const findUsersUseCase = makeFetchUsersUseCaseFactory();
      const response = await findUsersUseCase.execute();
      reply.status(200).send(response);
    },
  );
}
