import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns the current status of the server.
   *
   * @returns An object indicating the server is running.
   */
  getStatus() {
    return { status: 'Server is running' };
  }
}
