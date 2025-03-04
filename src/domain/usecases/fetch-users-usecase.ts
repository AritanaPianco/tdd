import type { User } from '../models/user';

export interface FetchUsers {
  execute(): Promise<User[]>;
}
