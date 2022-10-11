import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';

import { User } from '@safety/users/entities/user.entity';
import { DbAbstract } from '@common/database';
import { MyCrypt } from '@common/helpers/security';
import { MyTools } from '@common/helpers/varius';
import { UserCreateDto, UserUpdateDto } from './dto';
import { MySecurity } from '@common/helpers/security';

@Injectable()
export class UserService extends DbAbstract {
  // private readonly jwtService: JwtService;
  private readonly mySecurity = new MySecurity();
  private readonly myTools = new MyTools();
  private readonly myCrypt = new MyCrypt({});
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super(userRepository);
  }

  async createUser(userData: UserCreateDto, createPinActivation: boolean = false) {
    const pins = await this.myTools.generatePins({
      semillaCode: userData.user,
      name: userData.password,
      status: userData.is_active.toString(),
    });
    const token = await this.createUserToken(userData.user, userData.name, pins.salt);
    const pin_token = await this.mySecurity.otp({ text: token, secret: process.env.BACK_ALGORITHM_SECRET, size: 8 });

    let pin_activation = undefined;
    if (createPinActivation) {
      const baseRamdom = await this.mySecurity.numbersFromTimer(10);
      pin_activation = await this.mySecurity.generatePasswordSeed({
        baseRamdom,
      });
    }
    const dataToSave = await this.myTools.mergeData(userData, {
      token,
      pin_activation,
      password: pins.dataHash,
      pin_pass: pins.pinName,
      pin_status: pins.pinStatus,
      pin_token,
    });

    return await this.create(dataToSave);
  }

  async createUserToken(user: string, name: string, salt: string) {
    return await this.myTools.createExpireToken({
      sub: user,
      data: { other: name, salt: salt },
    });
  }

  async updateUser(id: string, body: UserUpdateDto) {
    return this.createUser({ id, ...body } as UserCreateDto, false);
  }

  async getUser(user: string, password: string): Promise<unknown> {
    const userDB = await this.validUser(user, password);
    return { user: userDB.id, name: userDB.name, tenant: userDB.tenant };
  }

  async validUser(user: string, password: string): Promise<User> {
    const userData = await this.findOne({ where: { user }, throwError: false });
    if (!userData) throw new NotFoundException('Credential no valid');
    if (!userData.is_active) throw new UnauthorizedException('User is inactive');

    const pin_token = await this.mySecurity.otp({ text: userData.token, secret: process.env.BACK_ALGORITHM_SECRET, size: 8 });
    if (userData.pin_token !== pin_token) throw new UnauthorizedException('Credential no valid.(pt)');

    // const jwtService = new JwtService({
    //   secret: process.env.BACK_TOKEN_JWT_SECRET,
    // });
    const { sub, data } = this.jwtService.decode(userData.token) as any;

    if (userData.user !== sub || userData.name !== data.other) throw new UnauthorizedException('Credential no valid.(t)');

    const pins = await this.myTools.generatePins({
      semillaCode: userData.user,
      name: password,
      status: userData.is_active.toString(),
      salt: data.salt,
    });

    if (userData.password !== pins.dataHash) throw new UnauthorizedException('Credential no valid.(p)');
    if (userData.pin_pass !== pins.pinName) throw new UnauthorizedException('Credential no valid.(pp)');
    if (userData.pin_status !== pins.pinStatus) throw new UnauthorizedException('Credential no valid.(ps)');

    return userData;
  }

  // async createReport(response: Response, userid:string ) {
  //   const objReport = new Reports();
  //   const data = await this.all([], {}, {}, []);

  //   if (data.length < 1) {
  //     throw new BadRequestException('there is no data to process');
  //   }

  //   const readFile = await myTools.normalizeFile(
  //     '../src/',
  //     'reports/security/userList',
  //     '.json',
  //   );

  //   const fileJson = await myTools.readJson(readFile);

  //   let dataToReplace = [];
  //   dataToReplace['empresa'] = process.env.BACK_ENTERPRICE_NAME;
  //   dataToReplace['direccion'] = process.env.BACK_ENTERPRICE_ADDRESS;

  //   const report = {
  //     obj: await objReport.report(
  //       {
  //         reportJson: fileJson,
  //         data: data,
  //         toReplace: dataToReplace,
  //       },
  //       response,
  //     ),
  //   };

  //   delete report.obj;
  // }

  async findByUserName(account: string): Promise<object> {
    return await this.findOne({ where: { accound: account } });
  }

  async checkPassword(account: string, password: string, passwordDB: string): Promise<boolean> {
    const name = account.replace(/@.*$/, '');
    return await bcrypt.compare(name + password, passwordDB);
  }

  async checkPasswordPin(user: User, password64: string, passwordSeed: string) {
    const password = await this.mySecurity.decodeData(password64, passwordSeed);

    const userAccount = user.user.replace(/@.*$/, '');

    if (!(await bcrypt.compare(userAccount + password, user.password))) {
      throw new BadRequestException('Invalid user credentials ...');
    }

    const pinPass = await this.mySecurity.otp({ text: userAccount, secret: password });
    const pinStatus = await this.mySecurity.otp({ text: userAccount, secret: user.is_active.toString() });

    if (pinPass !== user.pin_pass || pinStatus !== user.pin_status) {
      throw new BadRequestException('user security data was incorrectly modified.');
    }
  }

  async checkUserToken(user: User) {
    const { account, name } = this.jwtService.decode(user.token) as any;

    if (account !== user.user || name !== user.name) {
      throw new BadRequestException('User data was incorrectly modified..');
    }
  }

  async getToken(user: User, ip: string, branch: string, enterprise: string) {
    const userId = await this.myCrypt.encrypt(user.id);
    const clientIP = await this.myCrypt.encrypt(ip);
    const jwt = await this.jwtService.signAsync({ sub: userId, ip: clientIP, branch, enterprise });
    return jwt;
  }

  async unstructuredUser(userData: any[]): Promise<any[]> {
    return userData.map((user) => {
      user.roles = user.roles.map((role) => {
        const { createdAt, updatedAt, ...data } = role;
        return data;
      });
      const { password, token, pin_pass, pin_status, ...data } = user;
      return data;
    });
  }

  async createSuperAdmin(idSuperAdmin: string, tenant: string) {
    const userSuperAdmin: UserCreateDto = {
      user: process.env.BACK_SUPER_USER,
      name: process.env.BACK_SUPER_NAME,
      password: process.env.BACK_SUPER_PASSWORD,
      email: process.env.BACK_SUPER_EMAIL,
      tenant,
      is_active: true,
    };

    return await this.createUser(userSuperAdmin, false);
  }
}
