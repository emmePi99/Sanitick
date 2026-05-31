import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole } from '@shared';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    // Pulizia database dopo i test
    await dataSource.query('DELETE FROM "user"');
    await app.close();
  });

  const testUser = {
    email: 'e2e@test.com',
    password: 'Password123!',
    firstName: 'E2E',
    lastName: 'Tester',
    fiscalCode: 'RSSMRA80A01H501W', // CF fittizio valido per validazione se presente
    role: UserRole.PATIENT,
  };

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.email).toBe(testUser.email);
          expect(response.body.password).toBeUndefined(); // Password non deve essere restituita
        });
    });

    it('should throw conflict error if user already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return a JWT token on successful login', () => {
      // Nota: lo user è già stato creato nel test precedente
      // Ma è inattivo di default (isActive: false)
      // Per il login dobbiamo attivarlo o simulare il processo di attivazione
      // Per semplicità dell'E2E in questa fase, forziamo isActive: true nel DB
      return dataSource.query(`UPDATE "user" SET "isActive" = true WHERE "email" = '${testUser.email}'`)
        .then((updateResult) => {
          console.log('Update result:', updateResult);
          return request(app.getHttpServer())
            .post('/auth/login')
            .send({
              email: testUser.email,
              password: testUser.password,
            })
            .expect(201)
            .then((response) => {
              expect(response.body).toHaveProperty('accessToken');
            });
        });
    });

    it('should throw unauthorized error with wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
