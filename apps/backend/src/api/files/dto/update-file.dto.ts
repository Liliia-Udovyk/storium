import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFileDto {
  @ApiPropertyOptional({ example: 'renamed.pdf' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Folder ID to move the file to',
  })
  @IsOptional()
  @IsNumber()
  folderId?: number;
}
