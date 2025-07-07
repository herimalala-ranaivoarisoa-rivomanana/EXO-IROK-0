import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUrlRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

describe('UrlService', () => {
  let service: UrlService;
  let repository: jest.Mocked<Repository<Url>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: getRepositoryToken(Url), useFactory: mockUrlRepository },
      ],
    }).compile();
    service = module.get<UrlService>(UrlService);
    repository = module.get(getRepositoryToken(Url));
  });

  describe('generateShortCode', () => {
    it('should generate a code of default length', () => {
      // @ts-ignore
      const code = service.generateShortCode();
      expect(code).toHaveLength(6);
    });
    it('should generate a code of given length', () => {
      // @ts-ignore
      const code = service.generateShortCode(8);
      expect(code).toHaveLength(8);
    });
  });

  describe('create', () => {
    it('should create and return a new url entity', async () => {
      const dto = { originalUrl: 'https://google.com' };
      repository.findOne.mockResolvedValueOnce(null); // shortCode not exists
      repository.create.mockReturnValue({ ...dto, shortCode: 'abc123' } as any);
      repository.save.mockResolvedValue({ ...dto, shortCode: 'abc123' } as any);
      // @ts-ignore
      jest.spyOn(service, 'generateShortCode').mockReturnValue('abc123');
      const result = await service.create(dto);
      expect(result.shortCode).toBe('abc123');
      expect(repository.create).toHaveBeenCalledWith({ originalUrl: dto.originalUrl, shortCode: 'abc123' });
      expect(repository.save).toHaveBeenCalled();
    });
    it('should throw ConflictException if cannot generate unique short code', async () => {
      repository.findOne.mockResolvedValue({} as any); // always exists
      await expect(service.create({ originalUrl: 'x' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findByShortCode', () => {
    it('should return the url entity if found', async () => {
      repository.findOne.mockResolvedValue({ shortCode: 'abc', originalUrl: 'https://test.com' } as any);
      const result = await service.findByShortCode('abc');
      expect(result.originalUrl).toBe('https://test.com');
    });
    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findByShortCode('zzz')).rejects.toThrow(NotFoundException);
    });
  });
});
