import { Response, Request } from 'express';
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
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ParseUUIDPipe } from '@common/pipes/parse-uuid.pipe';
import { RolProtected } from '@common/decorators';
import { UserRoleGuard } from '@common/guards';
import { toBackResponse, TypeResponse } from '@common/helpers/responses';

import { ValidRoles } from '@safety/roles/enums';
import { BranchService } from './branch.service';
import { BranchCreateDto, BranchUpdateDto } from './dto';
import { Branch } from './entities/branch.entity';
import { ParamsGetList } from '@common/database';

@ApiTags('Branches')
@ApiBearerAuth()
@Controller('Branch')
export class BranchController {
  constructor(private controllerService: BranchService) {}

  @ApiOperation({ summary: 'Get branches for grid view.', description: 'Get branches for grid view.' })
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

  @ApiOperation({ summary: 'List of branches', description: 'Get all branches' })
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
    return toBackResponse('Records returned', { records: plainToInstance(Branch, data), meta });
  }

  @ApiOperation({ summary: 'Create a branch', description: 'Create a new branch' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been created successfully.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() body: BranchCreateDto, @Req() request: Request): Promise<TypeResponse> {
    const record: any = await this.controllerService.createBranch({ ...body });
    return toBackResponse('Record created successfully');
  }

  @ApiOperation({ summary: 'Get a branch', description: 'Get a branch by your id' })
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
    return toBackResponse('Record returned', { records: plainToInstance(Branch, data) });
  }

  @ApiOperation({ summary: 'Update a branch', description: 'Update a branch by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict, duplicate entry' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: BranchUpdateDto): Promise<TypeResponse> {
    const record: any = await this.controllerService.updateBranch(id, body);
    return toBackResponse('Record updated successfully');
  }
}
