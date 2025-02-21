export class Processo {
  private readonly numero: string;
  private static readonly options = ['1', '2', '3'];

  constructor(numero: string) {
    if (!Processo.isValid(numero)) {
      throw new Error('Numero inválido');
    }
    this.numero = numero;
  }

  private static isValid(numero: string): boolean {
    return Processo.options.includes(numero);
  }
}
