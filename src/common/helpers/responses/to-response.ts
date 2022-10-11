import { HttpStatus } from '@nestjs/common';

export type TypeResponse = {
  message?: string;
  data?: Object | Array<Object>;
  statusCode?: HttpStatus;
};

export function toBackResponse(message?: string): TypeResponse;
export function toBackResponse(message?: string, data?: Object | Array<Object>): TypeResponse;
export function toBackResponse(message?: string, data?: Object | Array<Object>, statusCode?: HttpStatus): TypeResponse;
export function toBackResponse(
  message?: string,
  data?: Object | Array<Object>,
  statusCode: HttpStatus = HttpStatus.OK,
): TypeResponse {
  let _message = '';
  let _data: any;
  let _statusCode: HttpStatus = HttpStatus.OK;
  if (message !== undefined) _message = message;
  if (data !== undefined) _data = data;
  if (statusCode !== undefined) _statusCode = statusCode;
  return { statusCode: _statusCode, message: _message, ..._data };
}
