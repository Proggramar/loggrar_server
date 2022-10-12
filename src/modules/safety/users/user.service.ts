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
import { UserCredential, UserDataLogin } from './interfaces';

@Injectable()
export class UserService extends DbAbstract {
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

  async createUserFromFront(userInfo: UserCreateDto) {
    // TODO: email activación
    const { user, password }: UserCredential = await this.descrifateCredencials(
      { user: userInfo.user, password: userInfo.password },
      userInfo.wizard,
    );

    const baseRamdom = await this.mySecurity.numbersFromTimer(10);
    const pin_activation = await this.mySecurity.generatePasswordSeed({ baseRamdom });
    const { pins, token, pin_token } = await this.generatePins({ ...userInfo, password });

    const recordToSave: UserCreateDto = (await this.myTools.mergeData(userInfo, {
      user,
      token,
      pin_activation,
      password: pins.dataHash,
      pin_pass: pins.pinName,
      pin_status: pins.pinStatus,
      pin_token,
    })) as UserCreateDto;

    return await this.saveUser(recordToSave);
  }

  async generatePins(userInfo: UserCreateDto | UserUpdateDto): Promise<any> {
    const pins = await this.myTools.generatePins({
      semillaCode: userInfo.user,
      name: userInfo.password,
      status: userInfo.is_active.toString(),
    });
    const token = await this.createUserToken(userInfo.user, userInfo.name, pins.salt);
    const pin_token = await this.mySecurity.otp({ text: token, secret: process.env.BACK_ALGORITHM_SECRET, size: 8 });
    return { pins, token, pin_token };
  }

  async updateUser(id: string, userInfo: UserUpdateDto) {
    const keyBaseCifrate = await this.mySecurity.decode(userInfo.wizard);
    const { user, password }: UserCredential = await this.descrifateCredencials(
      { user: userInfo.user, password: userInfo.password },
      keyBaseCifrate,
    );
    const { pins, token, pin_token } = await this.generatePins({ ...userInfo, password });
    const recordToSave: UserCreateDto = (await this.myTools.mergeData(userInfo, {
      user,
      token,
      password: pins.dataHash,
      pin_pass: pins.pinName,
      pin_status: pins.pinStatus,
      pin_token,
    })) as UserCreateDto;
    return this.saveUser({ id, ...recordToSave } as UserCreateDto);
  }

  async saveUser(recordToSave: UserCreateDto) {
    return await this.create(recordToSave);
  }

  async createUserToken(user: string, name: string, salt: string) {
    return await this.myTools.createExpireToken({
      sub: user,
      data: { other: name, salt: salt },
    });
  }

  async getUser(user: string, password: string): Promise<UserDataLogin> {
    const userDB = await this.validUser(user, password);
    return { user: userDB.id, name: userDB.name, tenant: userDB.tenant };
  }

  async validUser(user: string, password: string): Promise<User> {
    const userInfo = await this.findOne({ where: { user }, throwError: false });
    if (!userInfo) throw new NotFoundException('Credential no valid');
    if (!userInfo.is_active) throw new UnauthorizedException('User is inactive');

    const pin_token = await this.mySecurity.otp({ text: userInfo.token, secret: process.env.BACK_ALGORITHM_SECRET, size: 8 });
    if (userInfo.pin_token !== pin_token) throw new UnauthorizedException('Credential no valid.(pt)');

    const { sub, data } = this.jwtService.decode(userInfo.token) as any;

    if (userInfo.user !== sub || userInfo.name !== data.other) throw new UnauthorizedException('Credential no valid.(t)');

    const pins = await this.myTools.generatePins({
      semillaCode: userInfo.user,
      name: password,
      status: userInfo.is_active.toString(),
      salt: data.salt,
    });

    if (userInfo.password !== pins.dataHash) throw new UnauthorizedException('Credential no valid.(p)');
    if (userInfo.pin_pass !== pins.pinName) throw new UnauthorizedException('Credential no valid.(pp)');
    if (userInfo.pin_status !== pins.pinStatus) throw new UnauthorizedException('Credential no valid.(ps)');

    return userInfo;
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

  async findByUserName(user: string): Promise<object> {
    return await this.findOne({ where: { user } });
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

  async unstructuredUser(userInfo: any[]): Promise<any[]> {
    return userInfo.map((user) => {
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
      is_active: true,
      wizard: '',
      tenant,
    };

    const { pins, token, pin_token } = await this.generatePins({ ...userSuperAdmin, password: userSuperAdmin.password });
    const recordToSave: UserCreateDto = (await this.myTools.mergeData(userSuperAdmin, {
      token,
      password: pins.dataHash,
      pin_pass: pins.pinName,
      pin_status: pins.pinStatus,
      pin_token,
    })) as UserCreateDto;
    return this.saveUser(recordToSave);
  }

  async descrifateCredencials(userCredentials: UserCredential, passBase: string): Promise<UserCredential> {
    const user: string = await this.mySecurity.decodeData(userCredentials.user, passBase);
    const password: string = await this.mySecurity.decodeData(userCredentials.password, passBase);
    return { user, password };
  }
}
