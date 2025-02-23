import type { HashComparer } from '@/domain/cryptography/hash-comparer';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements HashComparer {
  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
