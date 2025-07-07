import { Injectable } from '@nestjs/common';

@Injectable()
/**
 * Service providing application-wide logic and utilities.
 */
export class AppService {
  /**
   * Returns a hello world message.
   * @returns {string} Hello message
   */
  getHello(): string {
    return 'Hello World!';
  }
}
