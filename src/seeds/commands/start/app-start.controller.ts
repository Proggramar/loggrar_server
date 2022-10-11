import { Request } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseUUIDPipe } from '@common/pipes/parse-uuid.pipe';
import { toBackResponse, TypeResponse } from '@common/helpers/responses';
import { Auth } from '@common/decorators';

import { AppStartService } from './app-start.service';

@ApiTags('AppStart')
@ApiBearerAuth()
@Controller('AppStart')
export class AppStartController {
  constructor(private readonly controllerService: AppStartService) {}

  @ApiOperation({ summary: 'APP start', description: 'App start configuration' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [] })
  @Get('start')
  async start() {
    await this.controllerService.appStart();
    return toBackResponse('Application initialized', {
      user_created: process.env.BACK_SUPER_USER,
      user_password: process.env.BACK_SUPER_PASSWORD,
    });
  }
}
