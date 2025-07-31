import { ApiProperty } from '@nestjs/swagger';

export class GoogleUserDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John', required: false })
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  lastName?: string;

  @ApiProperty({ example: 'https://avatar.url/image.jpg', required: false })
  picture?: string;

  @ApiProperty({ enum: ['google'], example: 'google' })
  provider: string;
}
