import { Request, Response } from 'express';

import { Controller, Get, Post, Body, Version, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MySecurity } from '@common/helpers/security';
import { toBackResponse } from '@common/helpers/responses';
import { AuthService } from './auth.service';
import { Auth, GetUser } from '@common/decorators';
import { ValidRoles } from '@safety/roles/enums';
import { UserCredential } from '@safety/users/interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiExcludeEndpoint()
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Get('generate-passport')
  async generateAppToken(): Promise<any> {
    const jwtLogin = await this.authService.makePassportToken();
    return toBackResponse('App-passport returned', { token: jwtLogin });
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'No authenticate to run this process.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super] })
  @Get('generate-acces-token')
  async generateToken(@Req() request: Request): Promise<any> {
    const objectToLogin = await this.authService.makeTokenToLogin(request);
    return toBackResponse('access-token returned', { data: objectToLogin });
  }

  @ApiOperation({ summary: 'User credential authentication' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [] })
  @Post('login')
  async login(@Body() userCredentials: UserCredential, @Req() request: Request, @GetUser() userReq: any): Promise<any> {
    const user = await this.authService.login(userCredentials, request, userReq);
    return toBackResponse('access-token returned', { user });
  }
}
