import type { Hash } from '@/domain/cryptography/hash';
import type { HashComparer } from '@/domain/cryptography/hash-comparer';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements HashComparer, Hash {
  async hash(value: string, salt: number): Promise<string> {
    const hashedValue = bcrypt.hash(value, salt);
    return hashedValue;
  }
  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
