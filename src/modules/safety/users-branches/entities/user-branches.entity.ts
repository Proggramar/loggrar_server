import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as UUID4 } from 'uuid';
import { Branch } from '@system/branches/entities/branch.entity';
import { Rol } from '@modules/safety/roles/entities/rol.entity';
import { User } from '@safety/users/entities/user.entity';
import { Permissions } from '@modules/safety/permissions/entities/permission.entity';

@Entity('safety_users_branches')
export class UserBranches {
  @PrimaryGeneratedColumn('uuid')
  id: string = UUID4;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Branch, (branch) => branch.id)
  @JoinColumn()
  branch: Branch;

  @ManyToOne(() => Rol, (rol) => rol.id)
  @JoinColumn()
  rol: Rol;
}
