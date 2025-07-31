import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @ApiProperty({
    example: 1,
    description: 'Auto-generated unique identifier',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2024-01-01T12:00:00.000Z',
    description: 'Entity creation timestamp (ISO string)',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T12:00:00.000Z',
    description: 'Last update timestamp (ISO string)',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
