import { AuthMiddleware } from '@/presentation/middleware/auth-middleware';
import type { Middleware } from '@/presentation/protocols';
import { makeLoadUserByTokenUseCaseFactory } from '../usecases/load-user-by-token-usecase-factory';

export const makeAuthMiddlwareFactory = (): Middleware => {
  return new AuthMiddleware(makeLoadUserByTokenUseCaseFactory());
};
