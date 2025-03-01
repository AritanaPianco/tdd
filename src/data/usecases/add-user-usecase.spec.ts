import type { Hash } from '@/domain/cryptography/hash';
import { AddUser } from './add-user-usecase';

describe('AddUser UseCase', () => {
  test('should call Hash with correct password', async () => {
    class HashStub implements Hash {
      async hash(value: string, salt: number): Promise<string> {
        return new Promise((resolve) => resolve('hashed_value'));
      }
    }

    const hashStub = new HashStub();
    const sut = new AddUser(hashStub);
    const user = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const hashSpy = vi.spyOn(hashStub, 'hash');
    await sut.execute(user);
    expect(hashSpy).toHaveBeenCalledWith(user.password, 8);
  });
});
