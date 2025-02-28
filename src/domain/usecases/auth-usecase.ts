export interface AuthModel {
  email: string;
  password: string;
}

export interface AuthUseCase {
  execute({ email, password }: AuthModel): Promise<string | null>;
}
