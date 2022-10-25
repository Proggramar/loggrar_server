import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ParseUUIDPipe } from '@common/pipes/parse-uuid.pipe';

import { Auth } from '@common/decorators';
// import { UserRoleGuard } from '@common/guards';
import { toBackResponse, TypeResponse } from '@common/helpers/responses';

import { ValidRoles } from '@safety/roles/enums';
import { RolService } from './rol.service';
import { Rol } from './entities/rol.entity';
import { RolCreateDto, RolUpdateDto } from './dto';
import { GetUser } from '@common/decorators/';
import { ParamsGetList } from '@common/database';

@ApiTags('Rol')
@ApiBearerAuth()
@Controller('Rol')
export class RolController {
  constructor(private controllerService: RolService) {}

  @ApiOperation({ summary: 'Get roles for grid view.', description: 'Get roles for grid view.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiQuery({
    name: 'params',
    description: 'Object with params datagrid quasar: columns[], descending, filter, page, rowsPerPage, sortBy',
    example:
      '{"params":{"sortBy":"name","descending":false,"page":1,"rowsPerPage":10,"filter":"","columns":[{"name":"id","align":"left","label":"id","field":"id"},{"name":"name","align":"left","label":"Nombre","field":"name","sortable":true,"filter":true},{"name":"rol_type","align":"left","label":"Tipo de Rol","field":"rol_type","sortable":false}]}}',
    required: true,
    type: String,
  })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator] })
  @Get('listGrid')
  async listGrid(@Query('params') params: string): Promise<TypeResponse> {
    const pagination: ParamsGetList = JSON.parse(params);
    const { data, meta } = await this.controllerService.getDataGrid({ ...pagination });
    return toBackResponse('Records returned', { records: data, meta });
  }

  @ApiOperation({ summary: 'List of Roles', description: 'Get all roles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator] })
  @Get()
  async all(): Promise<TypeResponse> {
    const { data, meta } = await this.controllerService.paginate({});
    return toBackResponse('Records returned', { records: data, meta });
    // return toBackResponse('Records returned', { records: plainToInstance(Rol, data), meta });
  }

  @ApiOperation({ summary: 'Get a rol', description: 'Get a rol by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator] })
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    const data = await this.controllerService.findOne({ where: { id } });
    return toBackResponse('Record returned', { records: plainToInstance(Rol, data) });
  }

  @ApiOperation({ summary: 'Get permission for a rol', description: 'Get permission for a rol by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator] })
  @Get('_permissions/:id')
  async Permission(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    const data = await this.controllerService.getPermissionModuleByRol(id);
    return toBackResponse('Record returned', { records: data });
  }

  @ApiOperation({ summary: 'Create a rol', description: 'Create a new rol' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been created successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator] })
  @Post()
  async create(@Body() body: RolCreateDto, @GetUser('sub') userId: string): Promise<TypeResponse> {
    const record: any = await this.controllerService.create({ ...body, audit: ['id', 'name'], userId });
    return toBackResponse('Record created successfully');
  }

  @ApiOperation({ summary: 'Save a rol permissions', description: 'Save a rol permissions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Records have been registered successfully....' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator] })
  @Post('_permissions')
  async permissions(@Body() body: any, @GetUser('sub') userId: string): Promise<TypeResponse> {
    await this.controllerService.savePermissionModuleByRol({ ...body, userId });
    return toBackResponse('Record saved successfully');
  }

  @ApiOperation({ summary: 'Update a rol', description: 'Update a rol by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict, duplicate entry' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator] })
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: RolUpdateDto): Promise<TypeResponse> {
    const updateResult: any = await this.controllerService.update(id, body);
    return toBackResponse('Record updated successfully');
  }

  @ApiOperation({ summary: 'Delete a rol', description: 'delete a rol by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator] })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    const deleteResult: any = await this.controllerService.remove({ id });
    return toBackResponse('Record deleted successfully');
  }
}
