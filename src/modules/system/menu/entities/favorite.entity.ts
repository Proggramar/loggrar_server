import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as UUID4 } from 'uuid';

import { MyModule } from '@safety/app-modules/entities/my-module.entity';

@Entity('menu_favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string = UUID4;

  @Column()
  user_id: string;

  @ManyToOne(() => MyModule, (myModule) => myModule.id)
  @JoinColumn()
  module: MyModule;
}
