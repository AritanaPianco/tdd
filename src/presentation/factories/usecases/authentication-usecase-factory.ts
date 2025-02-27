import { AuthenticationUseCase } from '@/data/usecases/authentication-usecase';
import { UsersRepository } from '@/infra/db/repositories/users-repository';
import { UsersTokenRepository } from '@/infra/db/repositories/users-token-repository';
import { BcryptAdapter } from '@/infra/providers/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '@/infra/providers/cryptography/jwt-adapter/jwt-adapter';

export const makeAuthenticationUseCaseFactory = () => {
  const usersRepository = new UsersRepository();
  const hashCompare = new BcryptAdapter();
  const encrypter = new JwtAdapter();
  const usersTokenRepository = new UsersTokenRepository();
  return new AuthenticationUseCase(
    usersRepository,
    hashCompare,
    encrypter,
    usersTokenRepository,
  );
};
