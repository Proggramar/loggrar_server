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
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { Auth } from '@common/decorators';
import { ParseUUIDPipe } from '@common/pipes/parse-uuid.pipe';
import { RolProtected } from '@common/decorators/rol-protected.decorator';
import { UserRoleGuard } from '@common/guards';
import { MyModuleService } from './module.service';
import { ValidRoles } from '@safety/roles/enums';
import { MyModuleCreateDto, MyModuleUpdateDto } from './dto';
import { MyModule } from '@modules/safety/app-modules/entities/my-module.entity';
import { toBackResponse, TypeResponse } from '@common/helpers/responses';
import { ParamsGetList } from '@common/database';

@ApiTags('Modules')
@ApiBearerAuth()
@Controller('Modules')
export class ModuleController {
  constructor(private controllerService: MyModuleService) {}

  @ApiOperation({ summary: 'Get app-modules for grid view.', description: 'Get app-modules for grid view.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiQuery({
    name: 'params',
    description: 'Object with params datagrid quasar: columns[], descending, filter, page, rowsPerPage, sortBy',
    required: true,
    type: String,
  })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super] })
  @Get('listGrid')
  async listGrid(@Query('params') params: string): Promise<TypeResponse> {
    const pagination: ParamsGetList = JSON.parse(params);
    const { data, meta } = await this.controllerService.getDataGrid({ ...pagination });
    return toBackResponse('Records returned', { records: data, meta });
  }

  @ApiOperation({ summary: 'List of app-modules', description: 'Get all app-modules' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super] })
  @Get()
  async all(): Promise<TypeResponse> {
    const { data, meta } = await this.controllerService.paginate({});
    return toBackResponse('Records returned', { records: plainToInstance(MyModule, data), meta });
  }

  @ApiOperation({ summary: 'Create a app-module', description: 'Create a new app-module' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been created successfully.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Auth({ roles: [ValidRoles.super] })
  @Post()
  async create(@Body() body: MyModuleCreateDto): Promise<TypeResponse> {
    const record: any = await this.controllerService.create(body);
    return toBackResponse('Record created successfully');
  }

  @ApiOperation({ summary: 'Get a app-module', description: 'Get a app-module by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super] })
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    const data = await this.controllerService.findOne({ where: { id } });
    return toBackResponse('Record returned', { records: plainToInstance(MyModule, data) });
  }

  @ApiOperation({ summary: 'Update a app-module', description: 'Update a app-module by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict, duplicate entry' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super] })
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: MyModuleUpdateDto): Promise<TypeResponse> {
    const updateResult: any = await this.controllerService.update(id, body);
    if (updateResult.affected && updateResult.affected > 0) return toBackResponse('Record updated successfully');
    throw new HttpException('Error updating data', HttpStatus.BAD_REQUEST);
  }

  @ApiOperation({ summary: 'Delete a app-module', description: 'delete a app-module by your id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super] })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<TypeResponse> {
    const deleteResult: any = await this.controllerService.remove({ id });

    if (deleteResult.affected && deleteResult.affected > 0) return toBackResponse('Record deleted successfully');
    throw new HttpException('Error deleting data', HttpStatus.BAD_REQUEST);
  }

  @ApiOperation({ summary: 'Update menu structure' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Process OK.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Unauthorized information.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [ValidRoles.super] })
  @Post('updateMenuStructure')
  async updateMenuStructure(@Body() menu: any): Promise<TypeResponse> {
    let updateResult: any;
    for (const item of menu.newOrder) {
      updateResult = await this.controllerService.update(item.id, { father: item.father, menu_order: item.position });
      if (updateResult.affected && updateResult.affected < 1)
        throw new HttpException('Error saving data', HttpStatus.BAD_REQUEST);
    }
    return toBackResponse('Record updated successfully');
  }
}
