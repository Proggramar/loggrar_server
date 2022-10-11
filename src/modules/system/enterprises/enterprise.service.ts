import { BadRequestException, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as moment from 'moment';

import { Enterprise } from './entities/enterprise.entity';
import { DbAbstract } from '@common/database/database-abstact.service';
import { MyTools } from '@common/helpers/varius';
import { EnterpriseCreateDto, EnterpriseUpdateDto } from './dto';
import { MyModule } from '@modules/safety/app-modules/entities/my-module.entity';
import { EnterpriseApplications } from './types';
import { MySecurity } from '@common/helpers/security';

@Injectable()
export class EnterpriseService extends DbAbstract {
  private readonly myTools = new MyTools();
  private readonly mySecurity = new MySecurity();
  constructor(
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    private readonly jwtService: JwtService,
  ) {
    super(enterpriseRepository);
  }

  async createEnterprise(enterpriseData: EnterpriseCreateDto): Promise<Enterprise> {
    const suscription_date = moment(enterpriseData.suscription_date).format('YYYY-MM-DD');
    const otp_date = await this.mySecurity.otp({ text: suscription_date, secret: process.env.BACK_ALGORITHM_SECRET, size: 6 });
    const token = await this.myTools.createExpireToken({
      sub: enterpriseData.code,
      data: {
        other: {
          enterpriseName: enterpriseData.name,
          license: enterpriseData.license,
          susctiption: enterpriseData.suscription,
          otp_date,
        },
      },
    });
    //license_plan_suscription_token
    const otp = await this.mySecurity.otp({ text: token, secret: process.env.BACK_ALGORITHM_SECRET, size: 8 });
    const { ...dataToSave } = {
      ...enterpriseData,
      suscription_date,
      token,
      pin_token: otp,
      audit: ['id', 'code', 'name'],
    };
    return (await this.create(dataToSave)) as Enterprise;
  }

  async updateEnterprise(id: string, body: EnterpriseUpdateDto) {
    return this.create({ id, ...body });
  }

  async checkEnterpriseToken(enterprise: Enterprise): Promise<boolean> {
    const {
      sub,
      data: { other },
    } = this.jwtService.decode(enterprise.token) as any;

    if (sub !== enterprise.code || other.enterpriseName !== enterprise.name)
      throw new ForbiddenException('Enterprise data was incorrectly modified (c-n)...');

    const otp = await this.mySecurity.otp({ text: enterprise.token, secret: process.env.BACK_ALGORITHM_SECRET, size: 8 });
    if (otp !== enterprise.pin_token) throw new ForbiddenException('Enterprise data was incorrectly modified (o)...');

    const otp_date = await this.mySecurity.otp({
      text: enterprise.suscription_date,
      secret: process.env.BACK_ALGORITHM_SECRET,
      size: 6,
    });
    if (otp_date !== other.otp_date) throw new ForbiddenException('Enterprise data was incorrectly modified (d)...');

    const suscriptionDate = parseInt(moment(enterprise.suscription_date).format('YYYYMMDD'));
    const now = parseInt(moment().format('YYYYMMDD'));
    if (now > suscriptionDate) throw new ForbiddenException('The enterprise has expired subscription...');

    const suscriptionToExpire = parseInt(moment(enterprise.suscription_date).add(-31, 'days').format('YYYYMMDD'));
    if (now > suscriptionToExpire) return true;

    return false;
  }

  async getTenantData(): Promise<EnterpriseCreateDto> {
    const mainTentanFile: string = await this.myTools.getFileName('../../../seeds/data-to-seed/data-main-tenant.json');

    const appTenant: EnterpriseCreateDto = await this.myTools.getDataFromFile(mainTentanFile);
    return appTenant;
  }

  async saveApplitcationsPermission(applications: MyModule[], tenantCreated: Enterprise) {
    const permissionData = await this.myTools.array2Byte([1]);
    let toEnterpriseApplications: EnterpriseApplications[] = [];

    for (let app of applications) {
      const pin_permission = await this.mySecurity.otp({
        text: permissionData.toString() + app.id,
        size: 6,
      });
      toEnterpriseApplications.push({
        application_id: app.id,
        permission: permissionData,
        pin_permission,
      });
    }
    const tenantUpdate = { applications: JSON.stringify(toEnterpriseApplications) };
    this.update(tenantCreated.id, tenantUpdate);
  }
}
