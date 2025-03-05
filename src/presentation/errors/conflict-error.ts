export class ConflictError extends Error {
  constructor(param: string) {
    super(`o ${param} informado já existe!`);
    this.name = 'ConflictError';
  }
}
