import * as path from 'path';
import * as fs from 'fs';
import { opendir } from 'fs/promises';

import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

import { JwtPayLoad, PinsGenerated } from '@common/interfaces';
import { MySecurity } from '../security/my-security';
import { FileSeeder } from '@seeds/interfaces/seeders.interface';
import { MyCrypt } from '../security';

export class MyTools {
  private readonly mySecurity = new MySecurity();
  private readonly myCripto = new MyCrypt({});
  // private readonly jwtService: JwtService;
  private readonly dataSource: DataSource;

  // TODO refactorizar

  async normalizeFile(subdirectory: string, fileName: string, extension: string) {
    let fileNameNormalized: string;
    if (process.env.NODE_ENV == 'dev') {
      fileNameNormalized = path.join(__dirname, '../../' + subdirectory + fileName + extension);
    } else {
      fileNameNormalized = path.join(__dirname, '../' + fileName + extension);
    }
    return fileNameNormalized;
  }

  async listFiles(directorySearch: string, pattern: string, files: FileSeeder[]): Promise<FileSeeder[]> {
    try {
      const directopryOpened = await opendir(directorySearch + '/');
      for await (const fileInDirectory of directopryOpened) {
        if (fileInDirectory.isDirectory()) {
          const newDir = directorySearch + '/' + fileInDirectory.name;
          await this.listFiles(newDir, pattern, files);
        } else {
          if (fileInDirectory.name.includes(pattern)) {
            files.push({
              file: fileInDirectory.name,
              directory: directorySearch,
              className: '',
            });
          }
        }
      }
      return files;
    } catch (err) {
      console.error(err);
    }
  }

  // TODO: revisar posicion del nombre de la clase (ya no esta 'extends')
  async readClass(files: FileSeeder[]) {
    files.map(async (file) => {
      let fileContent = await this.readFile(file.directory + '/' + file.file);
      let textClassPosition = fileContent.indexOf('export class ');
      if (textClassPosition > -1) {
        textClassPosition += 13;
        let textExtendsPosition = fileContent.indexOf('extends', textClassPosition);
        file.className = String(fileContent.substring(textClassPosition, textExtendsPosition)).trim();
      }
    });
    return;
  }

  async readJson(readFile: string): Promise<any> {
    try {
      return JSON.parse(await this.readFile(readFile));
    } catch (e) {
      throw new BadRequestException('data file not found');
    }
  }

  async readFile(readFile: string): Promise<string> {
    try {
      return fs.readFileSync(readFile, 'utf8');
    } catch (e) {
      throw new BadRequestException('file not found');
    }
  }

  async saveFile(fileName: string, dataToSave: string): Promise<boolean> {
    try {
      fs.writeFileSync(fileName, dataToSave, 'utf8');
      return true;
    } catch (e) {
      throw new BadRequestException('file not saved');
    }
  }

  async createExpireToken(payLoad: JwtPayLoad): Promise<string> {
    const jwtService = new JwtService({
      secret: process.env.BACK_TOKEN_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.BACK_TOKEN_JWT_USER_EXPIRES,
        audience: process.env.BACK_TOKEN_JWT_AUDIENCE,
      },
    });
    const jwt = await jwtService.signAsync(payLoad);
    return jwt;
  }

  async generatePins({ semillaCode = '', name = '', status = '', salt = '' }): Promise<PinsGenerated> {
    if (salt == '') salt = await bcrypt.genSalt(10);

    const semillaClean = semillaCode.replace(/@.*$/, '');

    const dataHash = await bcrypt.hash(semillaClean + name, salt);

    const pinSemillaCode = await this.mySecurity.otp({ text: semillaClean, secret: semillaClean });
    const pinName = await this.mySecurity.otp({ text: semillaClean, secret: name });
    const pinStatus = await this.mySecurity.otp({ text: semillaClean, secret: status });

    return { dataHash, pinSemillaCode, pinName, pinStatus, salt };
  }

  async array2Byte(numbers: number[]): Promise<number> {
    if (numbers.length > 8) {
      return 0;
    }
    let positions = [2, 4, 8, 16, 32, 64, 128, 256];
    let byte = 0;
    numbers.map((num) => {
      byte += num * positions[0];
      positions.shift();
    });

    return byte;
  }

  async byte2Araay(byte: number): Promise<number[]> {
    const positions = [256, 128, 64, 32, 16, 8, 4, 2];
    let numbers: number[] = [];
    positions.map((b) => {
      if (byte >= b) {
        numbers.push(1);
        byte -= b;
      } else {
        numbers.push(0);
      }
    });

    return numbers.reverse();
  }

  async mathEntity(fileName: string, filesClass: FileSeeder[]): Promise<string> {
    const classSeek = fileName.split('.')[0];
    const result = filesClass.filter((file) => file.file.split('.')[0] == classSeek);
    try {
      return result[0].className;
    } catch {
      return '';
    }
  }

  async putData(entity, valuesData) {
    try {
      await this.dataSource.createQueryBuilder().insert().into(entity).values(valuesData).execute();
    } catch (e) {
      console.log(e);
    }
  }

  async retrieveFields(fileName: FileSeeder): Promise<string[]> {
    let fields = [];
    let dataFile = await this.readJson(fileName.directory + '/' + fileName.file);
    if (dataFile && dataFile.length > 0) {
      const firstRecod = dataFile[0];
      fields = Object.keys(firstRecod);
    }

    return fields;
  }

  async getData(entity, fields: string[], where: any = null): Promise<any[]> {
    let data = [];
    try {
      let query = await this.dataSource.getRepository(entity).createQueryBuilder().select(fields);

      if (where) {
        query = query.where(`${where.field} ${where.operator} '${where.data}'`);
      }
      data = await query.getRawMany();
    } catch (e) {
      console.error(e);
    }
    return data;
  }

  async getYear(): Promise<number> {
    const date = new Date();
    return date.getFullYear();
  }

  async getLastDayOfMonth(year: number, month: number): Promise<number> {
    return new Date(year, month, 0).getDate();
  }

  async getMonthName(year: number, month: number): Promise<string> {
    const monthName = new Date(year, month, 0).toLocaleString('default', {
      month: 'long',
    });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }

  async validateIP(ipCifrated: string, ipToValidate: string) {
    const ipFromToken: string = await this.myCripto.decrypt(ipCifrated);
    const ipFromClient = ipToValidate == '::1' ? '127.0.0.1' : ipToValidate;
    if (ipFromToken !== ipFromClient) {
      throw new UnauthorizedException('Invalid authorization IP');
    }
  }

  async validateOTP(otpCifrated: string, otpFromToken: string) {
    const otpFromCredential: string = await this.mySecurity.decode(otpCifrated);
    if (otpFromCredential !== otpFromToken) {
      throw new UnauthorizedException('Invalid PIN');
    }
  }

  async getFileName(fileName: string): Promise<string> {
    return path.join(__dirname, fileName);
  }

  async getDataFromFile(fileName: string): Promise<any> {
    const dataInFile: any = await this.readJson(fileName);
    return dataInFile;
  }

  async mergeData(data1: object, data2: object) {
    return { ...data1, ...data2 };
  }
}
