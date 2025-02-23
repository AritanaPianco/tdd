export interface Encrypter {
  encrypt(userId: string): Promise<string>;
}
