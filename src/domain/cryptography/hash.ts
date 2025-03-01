export interface Hash {
  hash(value: string, salt: number): Promise<string>;
}
