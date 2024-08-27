import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { EnvironmentService } from './config/environment.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';
import { BookModule } from './book/book.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        type: environmentService.DB_TYPE as any,
        host: environmentService.DB_URL,
        port: environmentService.DB_PORT,
        database: environmentService.DB_NAME,
        username: environmentService.DB_USER,
        password: environmentService.DB_PASS,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        store: redisStore.redisStore as unknown as CacheStore,
        host: environmentService.REDIS_HOST,
        port: environmentService.REDIS_PORT,
      }),
    }),
    AuthorModule,
    CategoryModule,
    BookModule,
    AddressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
