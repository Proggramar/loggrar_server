import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { v4 as UUID4 } from 'uuid';

export abstract class AbstractEntity {
  @ApiProperty({ example: '', description: 'ID of Record', uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  id: string = UUID4;

  @ApiProperty({ example: '', description: 'Record is active true/false' })
  @ApiProperty()
  @Column({ default: false })
  is_active: boolean;

  @ApiProperty({ example: '', description: 'create date' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ example: '', description: 'update date' })
  @UpdateDateColumn()
  updated_at: Date;
}
