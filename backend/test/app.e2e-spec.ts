// Mock des variables d'environnement pour les tests e2e en local
process.env.TYPEORM_TYPE = 'postgres';
process.env.TYPEORM_HOST = 'localhost';
process.env.TYPEORM_PORT = '5432';
process.env.TYPEORM_USERNAME = 'urluser';
process.env.TYPEORM_PASSWORD = 'urlpass';
process.env.TYPEORM_DATABASE = 'urldb';
process.env.TYPEORM_SYNCHRONIZE = 'true';
process.env.TYPEORM_ENTITIES = 'src/**/*.entity.ts';
process.env.PORT = '3001';

// TEST E2E DÉSACTIVÉ À LA DEMANDE DE L'UTILISATEUR
// import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let shortCode: string;
  const originalUrl = 'https://example.com';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /url - should create and return a short URL', async () => {
    const res = await request(app.getHttpServer())
      .post('/url')
      .send({ originalUrl })
      .expect(201);
    console.log('POST /url response:', res.body);

    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body).toHaveProperty('shortCode');
    expect(res.body).toHaveProperty('originalUrl', originalUrl);

    shortCode = res.body.shortCode;
  });

  it('GET /:shortCode - should redirect to the original URL', async () => {
    expect(shortCode).toBeDefined();
    // Attendre 100ms pour laisser la base se synchroniser
    await new Promise(res => setTimeout(res, 100));
    const res = await request(app.getHttpServer())
      .get(`/${shortCode}`)
      .expect(302);

    expect(res.header['location']).toBe(originalUrl);
  });
});
