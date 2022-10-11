import { Column, Entity, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { AbstractEntity } from '@common/database';

@Entity('system_branches')
export class Branch extends AbstractEntity {
  @ApiProperty({ example: '', description: 'Code of branch' })
  @Index({ unique: true })
  @Column({ nullable: false })
  code: string;

  @ApiProperty({ example: '', description: 'Name of branch' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: '', description: 'Address of branch' })
  @Column({ nullable: false })
  address: string;

  @ApiProperty({ example: '', description: 'Phones of branch' })
  @Column({ nullable: false })
  phones: string;

  @ApiProperty({ example: '', description: 'Locality of branch' })
  @Column({ nullable: false })
  locality: string;

  @ApiProperty({ example: '', description: 'Email of branch' })
  @Column({ nullable: false })
  email: string;

  @ApiProperty({ example: '', description: 'Security token' })
  @Column({ type: 'text', nullable: false, default: '' })
  @Exclude()
  token: string;
}
