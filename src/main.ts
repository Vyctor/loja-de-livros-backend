import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { InitialSeedService } from './initial-seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  const seed = app.get(InitialSeedService);

  await seed.seedCountriesAndStates();
  await seed.seedAuthors();
  await seed.seedCategories();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
