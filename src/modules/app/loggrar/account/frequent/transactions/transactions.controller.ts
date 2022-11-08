import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ValidRoles } from '@safety/roles/enums';
import { Auth } from '@common/decorators';
import { toBackResponse, TypeResponse } from '@common/helpers/responses';
import { ParamsGetList } from '@common/database';
import { ParseUUIDPipe } from '@common/pipes/parse-uuid.pipe';

import { AccountTransactionsService } from './transactions-header.service';
import { AccountsTransactionsCreateDto, AccountsTransactionsUpdateDto } from './dto';

@ApiTags('Thirds')
@ApiBearerAuth()
@Controller('loggrar/Account/Frequent/Transactions')
export class AccountTransactionsController {
  constructor(private controllerService: AccountTransactionsService) {}

  @ApiOperation({ summary: 'Get transactions for grid view.', description: 'Get transactions for grid view.' })
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
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.accountant, ValidRoles.operator] })
  @Get('listGrid')
  async listGrid(@Query('params') params: string): Promise<TypeResponse> {
    const pagination: ParamsGetList = JSON.parse(params);
    const { data, meta } = await this.controllerService.getDataGrid({ ...pagination });
    return toBackResponse('Records returned', { records: data, meta });
  }

  @ApiOperation({ summary: 'List of transactions', description: 'Get all transaction' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.accountant, ValidRoles.operator] })
  @Get()
  async all(): Promise<TypeResponse> {
    const { data, meta } = await this.controllerService.paginate({});
    return toBackResponse('Records returned', { records: data, meta });
  }
  @ApiOperation({ summary: 'Get types for transactions', description: 'Get types ' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.accountant, ValidRoles.operator] })
  @Get('comboxData')
  async getTypes() {
    const { templates, periods } = await this.controllerService.getListsData();
    return toBackResponse('Records returned', { records: { templates, periods } });
  }

  @ApiOperation({ summary: 'Create a transaction', description: 'Create a new transaction' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been created successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.accountant, ValidRoles.operator] })
  @Post()
  async create(@Body() body: AccountsTransactionsCreateDto): Promise<TypeResponse> {
    const record: any = await this.controllerService.create(body);
    return toBackResponse('Record created successfully');
  }

  @ApiOperation({ summary: 'Get a transaction', description: 'Get a transaction by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.accountant, ValidRoles.operator] })
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    const data = await this.controllerService.findOne({ where: { id } });
    return toBackResponse('Record returned', { records: data });
  }

  @ApiOperation({ summary: 'Update a transaction', description: 'Update a transaction by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict, duplicate entry' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.accountant, ValidRoles.operator] })
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: AccountsTransactionsUpdateDto): Promise<TypeResponse> {
    const updateResult: any = await this.controllerService.update(id, body);
    return toBackResponse('Record updated successfully');
  }

  @ApiOperation({ summary: 'Delete a transaction', description: 'Delete a transaction by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict, duplicate entry' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super, ValidRoles.system, ValidRoles.administrator, ValidRoles.accountant, ValidRoles.operator] })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    const deleteResult: any = await this.controllerService.remove({ id });
    return toBackResponse('Record deleted successfully');
  }

  // @ApiOperation({
  //   summary: 'List of  account types',
  //   description: 'Get account types and relations',
  // })
  // @hasPermission([Role.WEBMASTER, Role.ADMINISTRATOR])
  // @UseGuards(JwtAuthGuard, PermissionGuard)
  // @Version('1')
  // @HttpCode(HttpStatus.OK)
  // @Get('listData')
  // async getTypes(@User('enterprise') enterprise: number) {
  //   const { sources, templates, periods } = await this.controllerService.getListsData(enterprise);

  //   return toBackResponse('Records returned', {
  //     records: {
  //       periods,
  //       templates,
  //     },
  //   });
  // }
}
