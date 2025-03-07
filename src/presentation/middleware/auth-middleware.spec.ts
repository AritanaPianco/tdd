import type { UserToken } from '@/domain/models/user-token';
import type { LoadUserByToken } from '@/domain/usecases/load-user-by-token';
import { AccessDeniedError } from '../errors';
import { forbiddenError, ok } from '../helpers';
import { AuthMiddleware } from './auth-middleware';

const makeLoadUserByToken = (): LoadUserByToken => {
  class LoadUserByTokenUseCaseStub implements LoadUserByToken {
    async execute(token: string): Promise<UserToken | null> {
      const fakerUser = {
        id: 'any_userTokenId',
        userId: 'any_id',
        token: 'any_token',
      };
      return new Promise((resolve) => resolve(fakerUser as UserToken));
    }
  }
  return new LoadUserByTokenUseCaseStub();
};

type SutTypes = {
  sut: AuthMiddleware;
  loadUserByTokenStub: LoadUserByToken;
};

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
  test('should call loadUserByTokenUseCase with correct access token', async () => {
    const { sut, loadUserByTokenStub } = makeSut();
    const httpRequest = {
      headers: {
        authorization: 'Bearer any_token',
      },
    };
    const executeSpy = vi.spyOn(loadUserByTokenStub, 'execute');
    await sut.handle(httpRequest);
    expect(executeSpy).toHaveBeenCalledWith('any_token');
  });
  test('should return 403 if loadUserByTokenUseCase returns null', async () => {
    const { sut, loadUserByTokenStub } = makeSut();
    const httpRequest = {
      headers: {
        authorization: 'any_token',
      },
    };
    vi.spyOn(loadUserByTokenStub, 'execute').mockReturnValueOnce(
      new Promise((resolve) => resolve(null)),
    );
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual(new AccessDeniedError());
    expect(response).toEqual(forbiddenError(new AccessDeniedError()));
  });
  test('should return 200 if loadUserByTokenUseCase returns an user', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      headers: {
        authorization: 'any_token',
      },
    };
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ userId: 'any_id' });
    expect(response).toEqual(ok({ userId: 'any_id' }));
  });
});
