import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { AbstractEntity } from '@common/database';
import { UserBranches } from '@safety/users-branches/entities/user-branches.entity';

@Entity('safety_users')
export class User extends AbstractEntity {
  @ApiProperty({ example: '', description: 'User ID' })
  @Index({ unique: true })
  @Column()
  user: string;

  @ApiProperty({ example: '', description: 'User nmae' })
  @Column()
  name: string;

  @ApiProperty({ example: '', description: 'User password' })
  @Column({ nullable: false, default: '' })
  @Exclude()
  password: string;

  @ApiProperty({ example: '', description: 'User email' })
  @Column({ nullable: false })
  email: string;

  @ApiProperty({ example: '', description: 'User pin activation' })
  @Column({ nullable: false, default: '' })
  @Exclude()
  pin_activation: string;

  @ApiProperty({ example: '', description: 'User security token' })
  @Column({ length: 2000, nullable: false })
  @Exclude()
  token: string;

  @ApiProperty({ example: '', description: 'User PIN password' })
  @Column({ length: 10, nullable: false })
  @Exclude()
  pin_pass: string;

  @ApiProperty({ example: '', description: 'User PIN status' })
  @Column({ length: 10, nullable: false })
  @Exclude()
  pin_status: string;

  @ApiProperty({ example: '', description: 'User TOKEN pin' })
  @Column({ length: 10, nullable: false })
  @Exclude()
  pin_token: string;

  @ApiProperty({
    example: '',
    description: 'The user is related to the tenant',
  })
  @Column()
  @Exclude()
  tenant: string;

  @ApiProperty()
  @OneToMany(() => UserBranches, (uerBranches) => uerBranches.user)
  branches: UserBranches[];
}
