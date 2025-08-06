import { ApiProperty } from '@nestjs/swagger';

export class FolderBreadcrumbDto {
  @ApiProperty({ example: 1, description: 'Folder ID' })
  id: number;

  @ApiProperty({ example: 'Projects', description: 'Folder name' })
  name: string;
}
