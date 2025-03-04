export interface AuthModel {
  email: string;
  password: string;
}

export interface Auth {
  execute({ email, password }: AuthModel): Promise<string | null>;
}
