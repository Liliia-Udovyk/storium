import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from './base.entity';
import { File } from './file.entity';
import { Folder } from './folder.entity';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Unique email address of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: false,
  })
  @Column({ nullable: true })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: false,
  })
  @Column({ nullable: true })
  lastName?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Profile picture URL',
    required: false,
  })
  @Column({ nullable: true })
  picture?: string;

  @ApiProperty({ example: 'google', description: 'OAuth provider' })
  @Column({ default: 'google' })
  provider: string;

  @ApiProperty({
    type: () => [File],
    description: 'Files owned by the user',
    required: false,
  })
  @OneToMany(() => File, (file) => file.owner)
  files: File[];

  @ApiProperty({
    type: () => [Folder],
    description: 'Folders owned by the user',
    required: false,
  })
  @OneToMany(() => Folder, (folder) => folder.owner)
  folders: Folder[];
}
