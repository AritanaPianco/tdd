import type { HashComparer } from '@/domain/cryptography/hash-comparer';
import type {
  LoadUserByEmailRepository,
  User,
} from '@/domain/repositories/load-user-by-email-repository';
import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '@/utils/errors';
import { AuthenticationUseCae } from './authentication-usecase';

const makeLoadUserByEmailRepository = (): LoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements LoadUserByEmailRepository {
    async loadByEmail(email: string): Promise<User | null> {
      const user: User = {
        id: 'any_id',
        email: 'valid_email@mail.com',
        password: 'hashed_password',
      };
      return user;
    }
  }
  return new LoadUserByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }

  return new HashComparerStub();
};

interface SutTypes {
  sut: AuthUseCase;
  loadUserByEmailRepository: LoadUserByEmailRepository;
  hashComparerStub: HashComparer;
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepository = makeLoadUserByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const sut = new AuthenticationUseCae(
    loadUserByEmailRepository,
    hashComparerStub,
  );
  return {
    sut,
    loadUserByEmailRepository,
    hashComparerStub,
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

  // test('should return null if an invalid password is provided', async () => {
  //   const { sut, loadUserByEmailRepository } = makeSut();
  //   const authModel = {
  //     email: 'valid_email@mail.com',
  //     password: 'invalid_password',
  //   };
  //   vi.spyOn(loadUserByEmailRepository, 'loadByEmail').mockReturnValueOnce(
  //     null!,
  //   );
  //   const token = await sut.execute(authModel);
  //   expect(token).toBeNull();
  // });
});
