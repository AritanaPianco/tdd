import { MissingParamError } from '../errors';
import { badRequest } from '../helpers/';
import { LoginController } from './login-controller';

describe('Login Router', () => {
  test('should return 400  if no email is provided', async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: 'any_passowrd',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
    expect(httpResponse.statusCode).toBe(400);
  });
});
