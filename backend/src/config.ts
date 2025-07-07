import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

/**
 * TypeORM configuration object for asynchronous database connection setup.
 */
export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  /**
   * Factory function to create TypeORM connection options based on environment variables.
   */
  useFactory: () => ({
    type: 'postgres' as const,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'urluser',
    password: process.env.DATABASE_PASSWORD || 'urlpass',
    database: process.env.DATABASE_NAME || 'urldb',
    autoLoadEntities: true,
    synchronize: true, // Set to false in production!
  }),
};
