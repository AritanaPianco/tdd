import type { UserProps } from '../models/user';

export interface UserRepository {
  loadByEmail(email: string): Promise<UserProps | null>;
}
