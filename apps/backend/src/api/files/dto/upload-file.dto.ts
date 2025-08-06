import { IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Folder id to associate the file with',
  })
  @Transform(({ value }) => {
    if (value === '' || value === undefined || value === null) {
      return undefined;
    }
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsOptional()
  @IsNumber({}, { message: 'folderId must be a valid number' })
  folderId?: number;
}
