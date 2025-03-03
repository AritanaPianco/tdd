import type { HttpRequest } from './http-request';
import type { HttpResponse } from './http-response';

export interface Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
