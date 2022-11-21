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

import { ReverseSeedersService } from './reverse-seeders.service';

@ApiTags('ReverseSeeders')
@ApiBearerAuth()
@Controller('ReverseSeeders')
export class ReverseSeedersController {
  constructor(private readonly controllerService: ReverseSeedersService) {}

  @ApiOperation({ summary: 'APP start', description: 'App start configuration' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [] })
  @Get('reverse')
  async start() {
    await this.controllerService.reverseSeeders();
    return toBackResponse('Seeders reversed');
  }
}
