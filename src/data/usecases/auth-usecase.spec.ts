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
      return new Promise((resolve) => resolve(null));
    }
  }
  return new LoadUserByEmailRepositoryStub();
};

interface SutTypes {
  sut: AuthUseCase;
  loadUserByEmailRepository: LoadUserByEmailRepository;
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepository = makeLoadUserByEmailRepository();
  const sut = new AuthenticationUseCae(loadUserByEmailRepository);
  return {
    sut,
    loadUserByEmailRepository,
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
});
