import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ example: 'My Folder', description: 'Folder name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 1, description: 'Parent folder ID' })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
