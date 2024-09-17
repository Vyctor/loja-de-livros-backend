import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { InitialSeedService } from './initial-seed.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  const seed = app.get(InitialSeedService);
  await seed.seedCountriesAndStates();
  await seed.seedAuthors();
  await seed.seedCategories();
  await seed.seedBooks();
  await seed.seedCoupons();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bookstore API')
    .setDescription('API for a bookstore')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
