import type { User } from '../models/user';

export interface AddUserUseCase {
  execute(user: User): Promise<void>;
}
