import type { User, UserProps } from '../models/user';

export interface UserRepository {
  loadByEmail(email: string): Promise<User | null>;
  create(data: User): Promise<void>;
  findAll(): Promise<User[]>;
}
