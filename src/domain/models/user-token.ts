import { v4 as uuidv4 } from 'uuid';

export type UserTokenProps = {
  userId: string;
  token: string;
};

export class UserToken {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _token: string,
  ) {}

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get token() {
    return this._token;
  }

  static create({ userId, token }: UserTokenProps) {
    const id = uuidv4();
    const userToken = new UserToken(id, userId, token);
    return userToken;
  }
}
