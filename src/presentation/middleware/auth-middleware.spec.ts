import type { User } from '@/domain/models/user';
import type { LoadUserByToken } from '@/domain/usecases/load-user-by-token';
import { AccessDeniedError } from '../errors';
import { forbiddenError } from '../helpers';
import { AuthMiddleware } from './auth-middleware';

const makeLoadUserByToken = (): LoadUserByToken => {
  class LoadUserByTokenStub implements LoadUserByToken {
    async execute(token: string): Promise<User> {
      return new Promise((resolve) => resolve(null!));
    }
  }
  return new LoadUserByTokenStub();
};

interface SutTypes {
  sut: AuthMiddleware;
  loadUserByTokenStub: LoadUserByToken;
}

const makeSut = (): SutTypes => {
  const loadUserByTokenStub = makeLoadUserByToken();
  const sut = new AuthMiddleware(loadUserByTokenStub);
  return {
    sut,
    loadUserByTokenStub,
  };
};

describe('AuthMiddleware', () => {
  test('should return 403 if no access token exists in headers', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      headers: {},
    };
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual(new AccessDeniedError());
    expect(response).toEqual(forbiddenError(new AccessDeniedError()));
  });
  test('should call loadUserByToken with correct access token', async () => {
    const { sut, loadUserByTokenStub } = makeSut();
    const httpRequest = {
      headers: {
        authorization: 'any_token',
      },
    };
    const executeSpy = vi.spyOn(loadUserByTokenStub, 'execute');
    await sut.handle(httpRequest);
    expect(executeSpy).toHaveBeenCalledWith('any_token');
  });
});
