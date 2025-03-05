import { FetchUsersController } from '@/presentation/controllers/fetch-users-controller';
import type { Controller } from '@/presentation/protocols';
import { makeFetchUsersUseCaseFactory } from '../usecases/fetch-users-usecase-factory';

export const makeFetchUsersControllerFactory = (): Controller => {
  return new FetchUsersController(makeFetchUsersUseCaseFactory());
};
