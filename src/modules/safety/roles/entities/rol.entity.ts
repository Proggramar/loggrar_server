import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ValidRoles } from '@safety/roles/enums';
import { Permissions } from '@safety/permissions/entities/permission.entity';
import { AbstractEntity } from '@common/database';
import { Expose } from 'class-transformer';

@Entity('safety_roles')
export class Rol extends AbstractEntity {
  @Index({ unique: true })
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'enum', enum: ValidRoles, default: ValidRoles.basic })
  rol_type: ValidRoles;

  @Column({ default: 3 })
  level: number;

  @OneToMany(() => Permissions, (permissions) => permissions.rol)
  permissions: Permissions[];
}
