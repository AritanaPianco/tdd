import type { Encrypter } from '@/domain/cryptography/encrypter';
import type { Hash } from '@/domain/cryptography/hash';
import type { User } from '@/domain/models/user';
import type { UserToken } from '@/domain/models/user-token';
import type { UserRepository } from '@/domain/repositories/user-repository';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import { ConflictError } from '@/presentation/errors';
import { conflictError } from '@/presentation/helpers';
import { UsersRepositoryInMemory } from '@/test/repositories-in-memory/users-repository-in-memory';
import { UsersTokenRepositoryInMemory } from '@/test/repositories-in-memory/users-token-repository-in-memory';
import { AddUserUseCase } from './add-user-usecase';

const makeFakerUser = () => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeHashStub = (): Hash => {
  class HashStub implements Hash {
    async hash(value: string, salt: number): Promise<string> {
      return new Promise((resolve) => resolve('hashed_value'));
    }
  }
  return new HashStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(userId: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new EncrypterStub();
};

interface SutTypes {
  sut: AddUserUseCase;
  hashStub: Hash;
  usersRepositoryStub: UserRepository;
  encrypterStub: Encrypter;
  usersTokenRepositoryStub: UserTokenRepository;
}

const makeSut = (): SutTypes => {
  const usersRepositoryStub = new UsersRepositoryInMemory();
  const hashStub = makeHashStub();
  const encrypterStub = makeEncrypter();
  const usersTokenRepositoryStub = new UsersTokenRepositoryInMemory();
  const sut = new AddUserUseCase(
    usersRepositoryStub,
    hashStub,
    encrypterStub,
    usersTokenRepositoryStub,
  );
  return {
    sut,
    hashStub,
    usersRepositoryStub,
    encrypterStub,
    usersTokenRepositoryStub,
  };
};

describe('AddUser UseCase', () => {
  test('should call UsersRepository with correct email', async () => {
    const { sut, usersRepositoryStub } = makeSut();
    const user = makeFakerUser();
    const loadByEmailSpy = vi.spyOn(usersRepositoryStub, 'loadByEmail');
    await sut.execute(user);
    expect(loadByEmailSpy).toHaveBeenCalledWith(user.email);
  });
  test('should return 409 if UsersRepository return an user ', async () => {
    const { sut, usersRepositoryStub } = makeSut();
    const user1 = {
      id: 'user1_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const user2 = {
      id: 'user2_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    await usersRepositoryStub.create(user1 as User);
    const response = await sut.execute(user2);
    expect(response).toEqual(conflictError('email'));
    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual(new ConflictError('email'));
  });
  test('should call Hash with correct password', async () => {
    const { sut, hashStub } = makeSut();
    const user = makeFakerUser();
    const hashSpy = vi.spyOn(hashStub, 'hash');
    await sut.execute(user);
    expect(hashSpy).toHaveBeenCalledWith(user.password, 8);
  });
  test('should call Encrypter', async () => {
    const { sut, encrypterStub } = makeSut();
    const user = makeFakerUser();
    const encryptSpy = vi.spyOn(encrypterStub, 'encrypt');
    await sut.execute(user);
    expect(encryptSpy).toHaveBeenCalled();
  });
  test('should call usersTokenRepository', async () => {
    const { sut, usersTokenRepositoryStub } = makeSut();
    const user = makeFakerUser();
    const createSpy = vi.spyOn(usersTokenRepositoryStub, 'create');
    await sut.execute(user);
    expect(createSpy).toHaveBeenCalled();
  });
  test('should create an user on success', async () => {
    const { sut, usersRepositoryStub } = makeSut();
    const user = makeFakerUser();
    const createSpy = vi.spyOn(usersRepositoryStub, 'create');
    await sut.execute(user);
    expect(createSpy).toHaveBeenCalled();
  });
});
