import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  apiName(): string {
    return `${process.env.BACK_APP_NAME}`;
  }
}
