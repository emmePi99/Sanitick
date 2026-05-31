import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { BookingConflictFilter } from './modules/api/booking/filter/booking-conflict.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new BookingConflictFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
