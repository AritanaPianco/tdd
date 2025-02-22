import type { Validator } from '@/presentation/protocols';
import validator from 'validator';

export class EmailValidator implements Validator {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
