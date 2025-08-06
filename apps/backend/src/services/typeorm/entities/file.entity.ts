import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Folder } from './folder.entity';

@Entity('files')
export class File extends BaseEntity {
  @ApiProperty({
    example: 'document.pdf',
    description: 'The name of the file including extension',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'application/pdf',
    description: 'The MIME type of the file (e.g., application/pdf, image/png)',
  })
  @Column()
  mimeType: string;

  @ApiProperty({
    example: 102400,
    description: 'Size of the file in bytes',
  })
  @Column()
  size: number;

  @ApiProperty({
    example: 'https://storage.example.com/files/uuid',
    description: 'Publicly accessible URL for downloading or viewing the file',
  })
  @Column()
  url: string;

  @ApiProperty({
    type: () => User,
    description: 'Owner of the file (the user who uploaded it)',
  })
  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  owner: User;

  @ApiProperty({
    type: () => Folder,
    required: false,
    nullable: true,
    description: 'The folder that contains this file, if any',
  })
  @ManyToOne(() => Folder, (folder) => folder.files, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  folder?: Folder | null;
}
