import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

describe('Swagger (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Replicate main.ts swagger setup
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

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/docs (Swagger UI)', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .expect(200)
      .expect('Content-Type', /html/);
  });

  it('GET /api/docs-json (Swagger JSON)', () => {
    return request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.info.title).toBe('Sanitick API');
        expect(response.body.tags).toBeDefined();
        // Check if some tags we added exist
        const tags = response.body.tags.map((t: any) => t.name);
        expect(tags).toContain('auth');
        expect(tags).toContain('booking');
        expect(tags).toContain('doctor');
      });
  });
});
