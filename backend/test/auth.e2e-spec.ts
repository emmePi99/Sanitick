import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole } from '@shared';
import { DataSource } from 'typeorm';
import { MailerService } from '../src/modules/core/mailer/service/mailer/mailer.service';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let hashedTestPassword: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailerService)
      .useValue({
        sendActivationEmail: jest.fn().mockResolvedValue(undefined),
        sendDoctorInvitation: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);
    hashedTestPassword = await bcrypt.hash('Password123!', 10);
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM "user"');
    await app.close();
  });

  const testUser = {
    email: 'e2e@test.com',
    password: 'Password123!',
    firstName: 'E2E',
    lastName: 'Tester',
    fiscalCode: 'RSSMRA80A01H501W',
    role: UserRole.PATIENT,
    isActive: false, // Inizia non attivo per testare il cambio password
  };

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);
    });
  });

  describe('/auth/change-password (POST)', () => {
    it('should successfully change password with valid token', async () => {
      const user = await dataSource.query(`SELECT "activationToken" FROM "user" WHERE "email" = '${testUser.email}'`);
      const token = user[0].activationToken;

      return request(app.getHttpServer())
        .post('/auth/change-password')
        .send({ token, password: 'NewPassword123!' })
        .expect(201);
    });

    it('should fail with empty password', async () => {
        const user = await dataSource.query(`SELECT "activationToken" FROM "user" WHERE "email" = '${testUser.email}'`);
        const token = user[0]?.activationToken || 'some-token';
  
        return request(app.getHttpServer())
          .post('/auth/change-password')
          .send({ token, password: '' })
          .expect(400);
      });

    it('should fail with invalid token', () => {
      return request(app.getHttpServer())
        .post('/auth/change-password')
        .send({ token: 'invalid-token', password: 'NewPassword123!' })
        .expect(404);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return a JWT token on successful login', async () => {
      // isActive diventa true dopo il cambio password
      await dataSource.query(`UPDATE "user" SET "isActive" = true WHERE "email" = '${testUser.email}'`);
      
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'NewPassword123!',
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('accessToken');
        });
    });
  });
});
