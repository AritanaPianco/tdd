import type { Hash } from '@/domain/cryptography/hash';
import type { User } from '@/domain/models/user';
import type { UserRepository } from '@/domain/repositories/user-repository';
import { AddUser } from './add-user-usecase';

const makeUserRepository = (): UserRepository => {
  class UserRepositoryStub implements UserRepository {
    async loadByEmail(email: string): Promise<User | null> {
      const user = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password',
      };
      return user as User;
    }
  }
  return new UserRepositoryStub();
};

const makeHashStub = (): Hash => {
  class HashStub implements Hash {
    async hash(value: string, salt: number): Promise<string> {
      return new Promise((resolve) => resolve('hashed_value'));
    }
  }
  return new HashStub();
};

interface SutTypes {
  sut: AddUser;
  hashStub: Hash;
  usersRepositoryStub: UserRepository;
}

const makeSut = (): SutTypes => {
  const usersRepositoryStub = makeUserRepository();
  const hashStub = makeHashStub();
  const sut = new AddUser(usersRepositoryStub, hashStub);
  return {
    sut,
    hashStub,
    usersRepositoryStub,
  };
};

describe('AddUser UseCase', () => {
  test('should call Hash with correct password', async () => {
    const { sut, hashStub } = makeSut();
    const user = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const hashSpy = vi.spyOn(hashStub, 'hash');
    await sut.execute(user);
    expect(hashSpy).toHaveBeenCalledWith(user.password, 8);
  });
  test('should call UsersRepository with correct email', async () => {
    const { sut, usersRepositoryStub } = makeSut();
    const user = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const loadByEmailSpy = vi.spyOn(usersRepositoryStub, 'loadByEmail');
    await sut.execute(user);
    expect(loadByEmailSpy).toHaveBeenCalledWith(user.email);
  });
});
