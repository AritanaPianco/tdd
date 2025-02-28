import type { User, UserProps } from '../models/user';

export interface UserRepository {
  loadByEmail(email: string): Promise<User | null>;
}
