import type { Validator } from '@/presentation/protocols';
import validator from 'validator';
import { EmailValidator } from './email-validator';

const makeSut = (): Validator => {
  return new EmailValidator();
};

describe('Email Validator', () => {
  test('should return true if validator returns true', () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid('valid_email@mail.com');
    expect(isEmailValid).toBe(true);
  });
  test('should return false if validator returns false', () => {
    const sut = makeSut();
    vi.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isEmailValid = sut.isValid('invalid_email@mail.com');
    expect(isEmailValid).toBe(false);
  });
  test('should call validator with correct email', () => {
    const sut = makeSut();
    const isEmailSpy = vi.spyOn(validator, 'isEmail');
    sut.isValid('valid_email@mail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });
});
