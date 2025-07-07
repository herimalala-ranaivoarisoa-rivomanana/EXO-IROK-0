import { Controller, Post, Body, Get, Param, Res, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
/**
 * Controller responsible for handling URL shortening and redirection endpoints.
 */
@Controller('url')
export class UrlController {
  /**
   * Creates an instance of UrlController.
   * @param urlService The URL service instance.
   */
  constructor(private readonly urlService: UrlService) {}

  @Get()
  /**
   * Retrieves all shortened URLs with their original and short codes.
   * @returns {Promise<Array<{shortUrl: string, shortCode: string, originalUrl: string}>>} List of URLs
   */
  async getAllUrls() {
    const urls = await this.urlService.findAll();
    return urls.map(url => ({
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${url.shortCode}`,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
    }));
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  /**
   * Creates a new shortened URL from the original URL provided.
   * @param createUrlDto The DTO containing the original URL.
   * @returns {Promise<{shortUrl: string, shortCode: string, originalUrl: string}>} The created short URL data.
   */
  async createShortUrl(@Body() createUrlDto: CreateUrlDto) {
    const url = await this.urlService.create(createUrlDto);
    return {
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${url.shortCode}`,
      shortCode: url.shortCode,
    };
  }

  @Get(':shortCode')
  /**
   * Returns the original URL based on the provided short code (plus de redirection HTTP).
   * @param shortCode The short code to look up.
   * @returns {Promise<{originalUrl: string}>} The original URL in JSON.
   */
  async getOriginalUrl(@Param('shortCode') shortCode: string) {
    console.log("PARAM",shortCode)
    const url = await this.urlService.findByShortCode(shortCode);
    return { originalUrl: url.originalUrl };
  }
}
