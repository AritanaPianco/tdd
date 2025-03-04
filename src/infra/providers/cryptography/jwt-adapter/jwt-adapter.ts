import type { Encrypter } from '@/domain/cryptography/encrypter';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import type { Decrypter } from '@/domain/cryptography/decrypter';

export class JwtAdapter implements Encrypter, Decrypter {
  async decrypt(value: string): Promise<string> {
    const decoded = jwt.verify(value, process.env.JWT_SECRET as string);
    return decoded as string;
  }

  async encrypt(userId: string): Promise<string> {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    return token;
  }
}
