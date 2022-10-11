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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ParseUUIDPipe } from '@common/pipes/parse-uuid.pipe';
import { UserRoleGuard } from '@common/guards';
import { RolProtected } from '@common/decorators';
import { toBackResponse, TypeResponse } from '@common/helpers/responses';

import { EnterpriseService } from './enterprise.service';
import { EnterpriseCreateDto, EnterpriseUpdateDto } from './dto';
import { ValidRoles } from '@safety/roles/enums';
import { Enterprise } from './entities/enterprise.entity';
import { ParamsGetList } from '@common/database';

@ApiTags('Enterprises')
@ApiBearerAuth()
@Controller('Enterprise')
export class EnterpriseController {
  constructor(private controllerService: EnterpriseService) {}

  @ApiOperation({ summary: 'Get enterprises for grid view.', description: 'Get enterprises for grid view.' })
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
  @Get('listGrid')
  async listGrid(@Query('params') params: string): Promise<TypeResponse> {
    const pagination: ParamsGetList = JSON.parse(params);
    const { data, meta } = await this.controllerService.getDataGrid({ ...pagination });
    return toBackResponse('Records returned', { records: data, meta });
  }

  @ApiOperation({ summary: 'List of Enterprises', description: 'Get all enterprises' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Get()
  async all(): Promise<TypeResponse> {
    const { data, meta } = await this.controllerService.paginate({});
    return toBackResponse('Records returned', { records: plainToInstance(Enterprise, data), meta });
  }

  @ApiOperation({ summary: 'Create a enterprise', description: 'Create a new enterprise' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been created successfully.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() body: EnterpriseCreateDto, @Req() request: Request): Promise<TypeResponse> {
    await this.controllerService.createEnterprise({ ...body });
    return toBackResponse('Record created successfully');
  }

  @ApiOperation({ summary: 'Get a enterprise', description: 'Get a enterprise by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    const data = await this.controllerService.findOne({ where: { id } });
    return toBackResponse('Record returned', { records: plainToInstance(Enterprise, data) });
  }

  @ApiOperation({ summary: 'Update a enterprise', description: 'Update a enterprise by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict, duplicate entry' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: EnterpriseUpdateDto): Promise<TypeResponse> {
    const record: any = await this.controllerService.updateEnterprise(id, { ...body });
    return toBackResponse('Record update successfully');
  }
}
