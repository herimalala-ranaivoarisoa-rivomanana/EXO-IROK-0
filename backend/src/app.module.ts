import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST || 'postgres',
      port: parseInt(process.env.TYPEORM_PORT || "5432", 10),
      username: process.env.TYPEORM_USERNAME || 'urluser',
      password: process.env.TYPEORM_PASSWORD || 'urlpass',
      database: process.env.TYPEORM_DATABASE || 'urldb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
/**
 * The root module of the application. Configures main modules, controllers, and providers.
 */
export class AppModule {}
