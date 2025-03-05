import type { Encrypter } from '@/domain/cryptography/encrypter';
import type { HashComparer } from '@/domain/cryptography/hash-comparer';
import type { User } from '@/domain/models/user';
import type { UserRepository } from '@/domain/repositories/user-repository';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import type { Auth, AuthModel } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '@/presentation/errors';
import { UsersRepositoryInMemory } from '@/test/repositories-in-memory/users-repository-in-memory';
import { UsersTokenRepositoryInMemory } from '@/test/repositories-in-memory/users-token-repository-in-memory';
import { AuthenticationUseCase } from './authentication-usecase';

const makeFakerUser = () => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  return new HashComparerStub();
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
  sut: Auth;
  usersRepository: UserRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  userTokenRepositoryStub: UserTokenRepository;
}

const makeSut = (): SutTypes => {
  const usersRepository = new UsersRepositoryInMemory();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const userTokenRepositoryStub = new UsersTokenRepositoryInMemory();
  const sut = new AuthenticationUseCase(
    usersRepository,
    hashComparerStub,
    encrypterStub,
    userTokenRepositoryStub,
  );
  return {
    sut,
    usersRepository,
    hashComparerStub,
    encrypterStub,
    userTokenRepositoryStub,
  };
};

describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const { sut } = makeSut();
    const authModel = {
      password: 'any_password',
    };
    const promise = sut.execute(authModel as AuthModel);
    await expect(promise).rejects.toThrow(new MissingParamError('any_field'));
  });
  test('should throw if no password is provided', async () => {
    const { sut } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
    };
    const promise = sut.execute(authModel as AuthModel);
    await expect(promise).rejects.toThrow(new MissingParamError('any_field'));
  });
  test('ensure calls LoadUserByEmailRepository with correct email', async () => {
    const { sut, usersRepository } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const loadByEmailSpy = vi.spyOn(usersRepository, 'loadByEmail');
    await sut.execute(authModel);
    expect(loadByEmailSpy).toHaveBeenCalledWith(authModel.email);
  });
  test('should return null if an invalid email is provided', async () => {
    const { sut, usersRepository } = makeSut();
    const authModel = {
      email: 'invalid_email@mail.com',
      password: 'any_password',
    };
    vi.spyOn(usersRepository, 'loadByEmail').mockReturnValueOnce(null!);
    const token = await sut.execute(authModel);
    expect(token).toBeNull();
  });
  test('should call HashComparer with correct values', async () => {
    const { sut, usersRepository, hashComparerStub } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const compareSpy = vi.spyOn(hashComparerStub, 'compare');
    await usersRepository.create(makeFakerUser() as User);
    const user = await usersRepository.loadByEmail(authModel.email);
    await sut.execute(authModel);
    expect(compareSpy).toHaveBeenCalledWith('any_password', user?.password);
  });

  test('should return null if an invalid password is provided to HashCompare', async () => {
    const { sut, hashComparerStub } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'invalid_password',
    };
    vi.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve) => resolve(false)),
    );
    const token = await sut.execute(authModel);
    expect(token).toBeNull();
  });
  test('should call Encrypter with correct userId', async () => {
    const { sut, usersRepository, encrypterStub } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const encrypterSpy = vi.spyOn(encrypterStub, 'encrypt');
    await usersRepository.create(makeFakerUser() as User);
    const user = await usersRepository.loadByEmail(authModel.email);
    await sut.execute(authModel);
    expect(encrypterSpy).toHaveBeenCalledWith(user?.id);
  });
  test('should return an accessToken if correct credentials are provided', async () => {
    const { sut, usersRepository } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    await usersRepository.create(makeFakerUser() as User);
    const token = await sut.execute(authModel);
    expect(token).toBeTruthy();
    expect(token).toBe('any_token');
  });
  test('should call UserTokenRepository with corrects values', async () => {
    const { sut, usersRepository, userTokenRepositoryStub } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const updateAccessTokenSpy = vi.spyOn(
      userTokenRepositoryStub,
      'updateAccessToken',
    );
    await usersRepository.create(makeFakerUser() as User);
    const token = await sut.execute(authModel);
    const user = await usersRepository.loadByEmail(authModel.email);
    expect(token).toBeTruthy();
    expect(token).toBe('any_token');
    expect(updateAccessTokenSpy).toHaveBeenCalledWith(user?.id, token);
  });
});
