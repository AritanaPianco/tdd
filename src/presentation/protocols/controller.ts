import type { HttpRequest } from './http-request';
import type { HttpResponse } from './http-response';

export interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
