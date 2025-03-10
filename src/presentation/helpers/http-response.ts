import { ConflictError } from '../errors';
import { ServerError, UnauthorizedError } from '../errors';
import type { HttpResponse } from '../protocols/';

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
};

export const unauthorizedError = (): HttpResponse => {
  return {
    statusCode: 401,
    body: new UnauthorizedError(),
  };
};
export const forbiddenError = (error: Error) => {
  return {
    statusCode: 403,
    body: error,
  };
};

export const serverError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(),
  };
};

export const conflictError = (param: string) => {
  return {
    statusCode: 409,
    body: new ConflictError(param),
  };
};

export const ok = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data,
  };
};
