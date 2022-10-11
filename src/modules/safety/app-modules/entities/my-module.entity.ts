import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Permissions } from '@safety/permissions/entities/permission.entity';
import { AbstractEntity } from '@common/database';

@Entity('safety_app_modules')
export class MyModule extends AbstractEntity {
  @ApiProperty({ example: '', description: 'User security token' })
  @Column({ length: 36, nullable: false })
  id_old: string;

  @ApiProperty({ example: '', description: 'Module name' })
  @Column()
  name: string;

  @ApiProperty({ example: '', description: 'Module component)' })
  @Column()
  component: string;

  @ApiProperty({ example: '', description: 'Module route (back)' })
  @Column()
  route: string;

  @ApiProperty({ example: '', description: 'Module parent' })
  @Column()
  father_id: string;

  @ApiProperty({ example: '', description: 'Module menu order' })
  @Column({ unsigned: true, default: 0 })
  menu_order: number;

  @ApiProperty({ example: '', description: 'Module name of video tutotial' })
  @Column({ default: '' })
  video_tutorial: string;

  @ApiProperty()
  @OneToMany(() => Permissions, (permissions) => permissions.module)
  permissions: Permissions[];
}
