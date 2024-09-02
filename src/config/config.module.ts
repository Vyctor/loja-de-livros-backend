import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('local', 'development', 'production')
          .default('local')
          .required(),
        REDIS_HOST: Joi.string().default('localhost').required(),
        REDIS_PORT: Joi.number().default(6379).required(),
        DB_TYPE: Joi.string().default('postgres').required(),
        DB_URL: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        PAYMENT_GATEWAY_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class ConfigModule {}
