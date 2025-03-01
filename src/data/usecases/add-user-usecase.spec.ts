import type { Hash } from '@/domain/cryptography/hash';
import { AddUser } from './add-user-usecase';

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
}

const makeSut = (): SutTypes => {
  const hashStub = makeHashStub();
  const sut = new AddUser(hashStub);
  return {
    sut,
    hashStub,
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
});
