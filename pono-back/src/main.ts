import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidateNotEmptyBodyPipe } from './guards/not-empty-body.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
    new ValidateNotEmptyBodyPipe(),
  );
  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
