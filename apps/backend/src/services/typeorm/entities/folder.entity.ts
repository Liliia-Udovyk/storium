import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { File } from './file.entity';

@Entity('folders')
export class Folder extends BaseEntity {
  @ApiProperty({ example: 'Projects', description: 'Folder name' })
  @Column()
  name: string;

  @ApiProperty({
    type: () => User,
    description: 'Owner of the folder',
  })
  @ManyToOne(() => User, (user) => user.folders, { onDelete: 'CASCADE' })
  owner: User;

  @ApiProperty({
    type: () => Folder,
    required: false,
    nullable: true,
    description: 'Parent folder (nullable)',
  })
  @ManyToOne(() => Folder, (folder) => folder.folders, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: Folder | null;

  @ApiProperty({
    type: () => [Folder],
    description: 'Child folders (NOT eagerly loaded)',
  })
  @OneToMany(() => Folder, (folder) => folder.parent, { eager: false })
  folders: Folder[];

  @ApiProperty({
    type: () => [File],
    description: 'Files in the folder (NOT eagerly loaded)',
  })
  @OneToMany(() => File, (file) => file.folder, { eager: false })
  files: File[];
}
