import { ApiProperty } from '@nestjs/swagger';

export class UpdateFolderDto {
  @ApiProperty({ example: 'New Folder Name', required: false })
  name?: string;

  @ApiProperty({
    example: 2,
    required: false,
    description: 'New parent folder ID (or null to un-nest)',
  })
  parentId?: number | null;
}
