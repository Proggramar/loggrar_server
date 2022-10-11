import { Reflector } from '@nestjs/core';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoggerAction, LOGGER_ACTION_KEY } from '@common/interfaces';
import { TableLogger } from '@common/helpers/security';
import { ValidAcions } from '@safety/roles/enums';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as any;
    const actionModule = this.reflector.get<LoggerAction>(LOGGER_ACTION_KEY, context.getHandler());

    if (!actionModule) {
      throw new Error('Action on module not found');
    }
    const userLogged = request.user;

    return next.handle().pipe(
      tap(() => {
        if (actionModule) {
          const myLogger = new TableLogger();

          myLogger.logProcess(
            ValidAcions.execute,
            `${actionModule.actionModule}`,
            userLogged.userUUID,
            `${actionModule.actionDetail}`,
          );
        }
      }),
    );
  }
}
