import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BookingConflictFilter } from './modules/api/booking/filter/booking-conflict.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Sanitick API')
    .setDescription('The Sanitick Medical Booking System API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication and Authorization')
    .addTag('booking', 'Booking and Availability management')
    .addTag('doctor', 'Doctor management')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new BookingConflictFilter());
  app.enableCors(); // Enable CORS
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
