import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFolderDto {
  @ApiProperty({ example: 'New Folder Name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 2,
    required: false,
    description: 'New parent folder ID (or null to un-nest)',
  })
  @IsOptional()
  parentId?: number | null;
}
