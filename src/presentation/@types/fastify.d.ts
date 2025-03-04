import 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    currentUserId: string;
  }
}
