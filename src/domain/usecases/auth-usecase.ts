export interface AuthModel {
  email: string;
  password: string;
}

export interface AuthUseCase {
  execute(authModel: AuthModel): Promise<string | null>;
}
