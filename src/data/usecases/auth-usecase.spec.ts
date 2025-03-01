import type { Encrypter } from '@/domain/cryptography/encrypter';
import type { HashComparer } from '@/domain/cryptography/hash-comparer';
import { type User, UserProps } from '@/domain/models/user';
import type { UserToken } from '@/domain/models/user-token';
import type { UserRepository } from '@/domain/repositories/user-repository';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '@/utils/errors';
import { AuthenticationUseCase } from './authentication-usecase';

const makeUserRepository = (): UserRepository => {
  class UserRepositoryStub implements UserRepository {
    async create(user: User): Promise<void> {}
    async loadByEmail(email: string): Promise<User | null> {
      const user = {
        id: 'any_id',
        name: 'any_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password',
      };
      return user as User;
    }
  }
  return new UserRepositoryStub();
};
const makeUserTokenRepository = (): UserTokenRepository => {
  class UserTokenRepositoryStub implements UserTokenRepository {
    async updateAccessToken(userId: string, token: string): Promise<void> {}
  }
  return new UserTokenRepositoryStub();
};

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
  sut: AuthUseCase;
  loadUserByEmailRepository: UserRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  userTokenRepositoryStub: UserTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepository = makeUserRepository();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const userTokenRepositoryStub = makeUserTokenRepository();
  const sut = new AuthenticationUseCase(
    loadUserByEmailRepository,
    hashComparerStub,
    encrypterStub,
    userTokenRepositoryStub,
  );
  return {
    sut,
    loadUserByEmailRepository,
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
    const { sut, loadUserByEmailRepository } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const loadByEmailSpy = vi.spyOn(loadUserByEmailRepository, 'loadByEmail');
    const token = await sut.execute(authModel);
    expect(loadByEmailSpy).toHaveBeenCalledWith(authModel.email);
  });
  test('should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepository } = makeSut();
    const authModel = {
      email: 'invalid_email@mail.com',
      password: 'any_password',
    };
    vi.spyOn(loadUserByEmailRepository, 'loadByEmail').mockReturnValueOnce(
      null!,
    );
    const token = await sut.execute(authModel);
    expect(token).toBeNull();
  });
  test('should call HashComparer with correct values', async () => {
    const { sut, loadUserByEmailRepository, hashComparerStub } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const compareSpy = vi.spyOn(hashComparerStub, 'compare');
    const user = await loadUserByEmailRepository.loadByEmail(authModel.email);
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
    const { sut, loadUserByEmailRepository, encrypterStub } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const encrypterSpy = vi.spyOn(encrypterStub, 'encrypt');
    const user = await loadUserByEmailRepository.loadByEmail(authModel.email);
    await sut.execute(authModel);
    expect(encrypterSpy).toHaveBeenCalledWith(user?.id);
  });
  test('should return an accessToken if correct credentials are provided', async () => {
    const { sut } = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const token = await sut.execute(authModel);
    expect(token).toBeTruthy();
    expect(token).toBe('any_token');
  });
  test('should call UserTokenRepository with corrects values', async () => {
    const { sut, loadUserByEmailRepository, userTokenRepositoryStub } =
      makeSut();
    const authModel = {
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const updateAccessTokenSpy = vi.spyOn(
      userTokenRepositoryStub,
      'updateAccessToken',
    );
    const token = await sut.execute(authModel);
    const user = await loadUserByEmailRepository.loadByEmail(authModel.email);
    expect(token).toBeTruthy();
    expect(token).toBe('any_token');
    expect(updateAccessTokenSpy).toHaveBeenCalledWith(user?.id, token);
  });
});
