import type { UserProps } from '../models/user';

export interface AddUser {
  execute(user: UserProps): Promise<string | any>;
}
