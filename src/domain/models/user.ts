import { v4 as uuidv4 } from 'uuid';

export type UserProps = {
  name: string;
  email: string;
  password: string;
};

export class User {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _email: string,
    private readonly _password: string,
  ) {}

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  static create({ name, email, password }: UserProps) {
    const id = uuidv4();
    const user = new User(id, name, email, password);

    return user;
  }
}
