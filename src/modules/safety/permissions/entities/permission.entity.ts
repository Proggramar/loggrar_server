import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { MyModule } from '@safety/app-modules/entities/my-module.entity';
import { Rol } from '@modules/safety/roles/entities/rol.entity';
import { v4 as UUID4 } from 'uuid';

@Entity('safety_permissions')
@Index(['rol', 'module'], { unique: true })
export class Permissions {
  @PrimaryGeneratedColumn('uuid')
  id: string = UUID4;

  @ApiProperty({ example: '', description: 'Permissions Rol' })
  @ManyToOne(() => Rol, (rol) => rol.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  rol: Rol;

  @ApiProperty({ example: '', description: 'Permissions module' })
  @ManyToOne(() => MyModule, (myModule) => myModule.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  module: MyModule;

  @ApiProperty({ example: '', description: 'Permissions' })
  @Column({ unsigned: true })
  permission: number;

  @ApiProperty({ example: '', description: 'Permissions security PIN' })
  @Column()
  pin_permission: string;
}
