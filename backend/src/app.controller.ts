import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
/**
 * Controller responsible for handling application root endpoints.
 */
export class AppController {
  /**
   * Creates an instance of AppController.
   * @param appService The application service instance.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Handles GET requests to the root endpoint and returns a hello message.
   * @returns {string} The hello message from the service.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
