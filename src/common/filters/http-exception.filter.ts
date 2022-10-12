import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { TableLogger } from '@common/helpers/security';
import { ValidAcions } from '@safety/roles/enums';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const msg = exception instanceof HttpException ? exception.getResponse() : exception;
    const message = `Status ${status} Error: ${JSON.stringify(msg)}`;
    const messageToResponse = process.env.NODE_ENV == 'dev' ? message : 'It was recorded in the log table';

    const userLogged = request.user;
    const user_id: string = userLogged ? userLogged.sub : '';

    const myTableLogger = new TableLogger();

    myTableLogger.logProcess(ValidAcions.execute, 'exception', user_id, `${request.url} «» ${message}`);

    this.logger.error('exception occurred, logged in log table' + message);

    response.status(status).json({
      status: status,
      message: msg.message,
      data: [],
      error: messageToResponse,
    });
  }
}
