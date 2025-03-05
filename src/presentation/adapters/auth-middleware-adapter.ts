import type { FastifyReply, FastifyRequest } from 'fastify';
import { makeAuthMiddlwareFactory } from '../factories/auth-middleware/auth-middleware-factory';
import type { HttpRequest } from '../protocols';

export const authMiddlewareAdapter = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const customHttpRequest: HttpRequest = {
      headers: request.headers,
    };

    const authMiddleware = makeAuthMiddlwareFactory();
    const response = await authMiddleware.handle(customHttpRequest);

    if (response.statusCode === 200) {
      const { userId } = response.body;
      request.currentUserId = userId;
    } else {
      reply.status(response.statusCode).send(response.body);
    }
  } catch (error) {
    reply.status(500).send(error);
  }
};
