export interface User {
  id: string;
  email: string;
  password: string;
}

export interface LoadUserByEmailRepository {
  loadByEmail(email: string): Promise<User | null>;
}
