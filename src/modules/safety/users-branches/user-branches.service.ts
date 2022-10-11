import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { UserBranches } from '@safety/users-branches/entities/user-branches.entity';
import { DbAbstract } from '@common/database';
import { UserBranchesCreateDto, UserBracnhesUpdateDto } from './dto';
import { User } from '@safety/users/entities/user.entity';
import { Branch } from '@system/branches/entities/branch.entity';

@Injectable()
export class UserBranchesService extends DbAbstract {
  constructor(
    @InjectRepository(UserBranches)
    private readonly userBranchesRepository: Repository<UserBranches>,
    private readonly dataSource: DataSource,
  ) {
    super(userBranchesRepository);
  }

  async createUserBranches(userSaved: User, branchSaved: Branch, idRolSuperAdmin: string) {
    const userBranchs: UserBranchesCreateDto = {
      user: userSaved.id,
      branch: branchSaved.id,
      rol: idRolSuperAdmin,
    };

    await this.create(userBranchs);
  }

  async findBranches(user: string, branch: string = '', module: string = ''): Promise<any | null> {
    let select: string =
      'branch.id branchId, branch.name branchName,' + 'rol.id rolId, rol.name rolName, rol.rol_type rolType, rol.level rolLevel ';
    if (module != '') select += ', permissions.permission modulePermission, permissions.pin_permission pinPermission ';
    try {
      let query = this.dataSource
        .createQueryBuilder()
        .from(UserBranches, 'userBanches')
        .select(select)
        .leftJoin('userBanches.branch', 'branch')
        .leftJoin('userBanches.rol', 'rol')
        .where('userBanches.user_id = :id', { id: user });
      if (branch != '') query.andWhere('userBanches.branch_id=:idb', { idb: branch });
      if (module != '') {
        query.leftJoin('rol.permissions', 'permissions');
        query.andWhere('permissions.module_id=:idm', { idm: module });
      }

      const data: any[] = await query.getRawMany();
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
