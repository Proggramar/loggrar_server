import { CallHandler, ExecutionContext, NestInterceptor, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export class TimeOutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    let EndPoinTimeOutInterceptor: number = +process.env.BACK_APP_TIMEOUTINTERCEPTOR;

    try {
      if (request.headers.endpointtimeout) {
        EndPoinTimeOutInterceptor = +request.headers.endpointtimeout;
      }
    } catch {}

    return next.handle().pipe(
      timeout(EndPoinTimeOutInterceptor),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => new Error(err));
      }),
    );
  }
}
