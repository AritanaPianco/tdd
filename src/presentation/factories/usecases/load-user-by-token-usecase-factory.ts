import { LoadUserByTokenUseCase } from '@/data/usecases/load-user-by-token-usecase';
import type { LoadUserByToken } from '@/domain/usecases/load-user-by-token';
import { UsersTokenRepository } from '@/infra/db/repositories/users-token-repository';
import { JwtAdapter } from '@/infra/providers/cryptography/jwt-adapter/jwt-adapter';

export const makeLoadUserByTokenUseCaseFactory = (): LoadUserByToken => {
  const decrypter = new JwtAdapter();
  const usersTokenRepository = new UsersTokenRepository();
  return new LoadUserByTokenUseCase(decrypter, usersTokenRepository);
};
