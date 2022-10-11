import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseUUIDPipe } from '@common/pipes/parse-uuid.pipe';
import { RolProtected } from '@common/decorators';
import { UserRoleGuard } from '@common/guards';
import { FavoriteService } from './favorite.service';
import { ValidRoles } from '@safety/roles/enums';
import { FavoriteCreateDto } from './dto';
import { GetUser } from '@common/decorators';
import { toBackResponse, TypeResponse } from '@common/helpers/responses';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('Favorites')
export class FavoriteController {
  constructor(private controllerService: FavoriteService) {}

  @ApiOperation({ summary: 'Create a favorite module', description: 'Create a favorite module' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been created successfully.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  // @RoleProtected([
  //   ValidRoles.SUPER,
  //   ValidRoles.ADMINISTRATOR,
  //   ValidRoles.OPERATOR,
  //   ValidRoles.ACCOUNTANT,
  //   ValidRoles.SYSTEM,
  // ])
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() body: FavoriteCreateDto, @GetUser('user_id') userId: string): Promise<TypeResponse> {
    const record: any = await this.controllerService.create({ ...body, user_id: userId });
    return toBackResponse('Record created successfully');
  }

  @ApiOperation({ summary: 'Delete a favorite module', description: 'delete a favorite module by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  // @RoleProtected([
  //   ValidRoles.SUPER,
  //   ValidRoles.ADMINISTRATOR,
  //   ValidRoles.OPERATOR,
  //   ValidRoles.ACCOUNTANT,
  //   ValidRoles.SYSTEM,
  // ])
  @Version('1')
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @GetUser('sub') userId: string) {
    this.controllerService.removeFavorite(userId, id);
    return toBackResponse('Record deleted successfully');
  }
}
