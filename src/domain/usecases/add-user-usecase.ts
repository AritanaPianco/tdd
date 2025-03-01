import type { UserProps } from '../models/user';

export interface AddUserUseCase {
  execute(user: UserProps): Promise<void>;
}
