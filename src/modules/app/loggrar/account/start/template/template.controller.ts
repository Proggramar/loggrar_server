import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ValidRoles } from '@safety/roles/enums';
import { Auth } from '@common/decorators';
import { toBackResponse, TypeResponse } from '@common/helpers/responses';
import { ParamsGetList } from '@common/database';
import { ParseUUIDPipe } from '@common/pipes/parse-uuid.pipe';

import { TemplateService } from './template.service';
import { TemplateCreateDTO, TemplateUpdateDTO } from './dto';

@ApiTags('Templates')
@ApiBearerAuth()
@Controller('loggrar/Account/Start/Template')
export class TemplateController {
  constructor(private controllerService: TemplateService) {}

  @ApiOperation({ summary: 'Get templates for grid view.', description: 'Get templates for grid view.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiQuery({
    name: 'params',
    description: 'Object with params datagrid quasar: columns[], descending, filter, page, rowsPerPage, sortBy',
    required: true,
    type: String,
  })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.basic] })
  @Get('listGrid')
  async listGrid(@Query('params') params: string): Promise<TypeResponse> {
    const pagination: ParamsGetList = JSON.parse(params);
    const { data, meta } = await this.controllerService.getDataGrid({ ...pagination });
    return toBackResponse('Records returned', { records: data, meta });
  }

  @ApiOperation({ summary: 'List of templates', description: 'Get all template' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.basic] })
  @Get()
  async all(): Promise<TypeResponse> {
    const { data, meta } = await this.controllerService.paginate({});
    return toBackResponse('Records returned', { records: data, meta });
  }

  @ApiOperation({ summary: 'Get types for a tax', description: 'Get types ' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.basic] })
  @Get('getComboxData')
  async getComboxData(@Param('account') code: string): Promise<TypeResponse> {
    const data = await this.controllerService.getListsData();
    return toBackResponse('Records returned', { records: { ...data } });
  }

  @ApiOperation({ summary: 'Create a template', description: 'Create a new template' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been created successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.basic] })
  @Post()
  async create(@Body() body: TemplateCreateDTO): Promise<TypeResponse> {
    const record: any = await this.controllerService.create(body);
    return toBackResponse('Record created successfully');
  }

  @ApiOperation({ summary: 'Get a template', description: 'Get a template by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.basic] })
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    //   const data = await this.controllerService.findOne({ id }, ['templateBody']);
    const data = await this.controllerService.findOne({ where: { id } });
    return toBackResponse('Record returned', { records: data });
  }

  @ApiOperation({ summary: 'Update a template', description: 'Update a template by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict, duplicate entry' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.basic] })
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: TemplateUpdateDTO): Promise<TypeResponse> {
    const updateResult: any = await this.controllerService.update(id, body);
    return toBackResponse('Record updated successfully');
  }

  @ApiOperation({ summary: 'Delete a template', description: 'Delete a template by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict, duplicate entry' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.basic] })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    const deleteResult: any = await this.controllerService.remove({ id });
    return toBackResponse('Record deleted successfully');
  }
}
