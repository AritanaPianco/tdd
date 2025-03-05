import type { User } from '@/domain/models/user';
import { UsersRepositoryInMemory } from '@/test/repositories-in-memory/users-repository-in-memory';
import { FetchUsersUseCase } from './fetch-users-usecase';

const makeFakerUser = () => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeSut = () => {
  const usersRepositoryStub = new UsersRepositoryInMemory();
  const sut = new FetchUsersUseCase(usersRepositoryStub);

  return {
    sut,
    usersRepositoryStub,
  };
};

describe('FetchUsers UseCase', () => {
  test('should return a list of users', async () => {
    const { sut, usersRepositoryStub } = makeSut();
    for (let i = 0; i < 20; i++) {
      await usersRepositoryStub.create(makeFakerUser() as User);
    }

    const users = await sut.execute();
    expect(users).toHaveLength(20);
  });
});
