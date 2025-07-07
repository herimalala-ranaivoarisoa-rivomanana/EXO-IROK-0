import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
/**
 * Service responsible for URL shortening, storage, and retrieval logic.
 */
@Injectable()
export class UrlService {
  /**
   * Retrieves all URL entities from the database, ordered by descending ID.
   * @returns {Promise<Url[]>} List of URL entities
   */
  async findAll(): Promise<Url[]> {
    const all = await this.urlRepository.find({ order: { id: 'DESC' } });
    console.log('[findAll] Contenu de la table Url:', all);
    return all;
  }

  /**
   * Creates an instance of UrlService.
   * @param urlRepository The repository for URL entities.
   */
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  /**
   * Generates a random short code for URL shortening.
   * @param length The desired length of the short code (default: 6)
   * @returns {string} The generated short code
   */
  private generateShortCode(length = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Creates and stores a new shortened URL entity.
   * @param createUrlDto The DTO containing the original URL to shorten.
   * @returns {Promise<Url>} The newly created URL entity
   * @throws {ConflictException} If a unique short code cannot be generated
   */
  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    let shortCode = '';
    let exists = true;
    let attempts = 0;
    // Ensure unique shortCode
    while (exists && attempts < 5) {
      shortCode = this.generateShortCode();
      exists = !!(await this.urlRepository.findOne({ where: { shortCode } }));
      attempts++;
    }
    if (exists) {
      throw new ConflictException('Could not generate unique short code.');
    }
    const url = this.urlRepository.create({
      originalUrl: createUrlDto.originalUrl,
      shortCode,
    });
    return this.urlRepository.save(url);
  }

  /**
   * Finds a URL entity by its short code.
   * @param shortCode The short code to search for.
   * @returns {Promise<Url>} The found URL entity
   * @throws {NotFoundException} If the short code does not exist
   */
  async findByShortCode(shortCode: string): Promise<Url> {
    console.log("shortCode>>>>",shortCode)
    const url = await this.urlRepository.findOne({ where: { shortCode } });
    console.log("URL>>>>",url)
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    return url;
  }
}
