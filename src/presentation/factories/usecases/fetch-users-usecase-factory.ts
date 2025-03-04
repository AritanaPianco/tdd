import { FetchUsersUseCase } from '@/data/usecases/fetch-users-usecase';
import type { FetchUsers } from '@/domain/usecases/fetch-users-usecase';
import { UsersRepository } from '@/infra/db/repositories/users-repository';

export const makeFetchUsersUseCaseFactory = (): FetchUsers => {
  const usersRepository = new UsersRepository();
  return new FetchUsersUseCase(usersRepository);
};
