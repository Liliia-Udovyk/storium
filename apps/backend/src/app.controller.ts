import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Root endpoint to check server status.
   *
   * @returns An object with the server status message.
   */
  @Get()
  @ApiOperation({
    summary: 'Get server status',
    description:
      'Returns a simple JSON object indicating that the server is running.',
  })
  @ApiResponse({
    status: 200,
    description: 'Server is running',
    schema: {
      example: { status: 'Server is running' },
    },
  })
  getRoot() {
    return this.appService.getStatus();
  }
}
