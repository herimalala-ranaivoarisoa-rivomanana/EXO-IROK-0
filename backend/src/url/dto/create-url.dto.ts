import { IsUrl, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for creating a new short URL.
 */
export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  /**
   * The original URL to be shortened.
   */
  originalUrl: string;
}
