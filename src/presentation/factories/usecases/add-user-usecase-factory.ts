import { AddUser } from '@/data/usecases/add-user-usecase';
import { UsersRepository } from '@/infra/db/repositories/users-repository';
import { UsersTokenRepository } from '@/infra/db/repositories/users-token-repository';
import { BcryptAdapter } from '@/infra/providers/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '@/infra/providers/cryptography/jwt-adapter/jwt-adapter';

export const makeAddUserUseCaseFactory = () => {
  const usersRepository = new UsersRepository();
  const hash = new BcryptAdapter();
  const encrypter = new JwtAdapter();
  const usersTokenRepository = new UsersTokenRepository();
  return new AddUser(usersRepository, hash, encrypter, usersTokenRepository);
};
