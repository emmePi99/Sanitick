import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole } from '@shared';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let patientToken: string;
  let doctorId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);
    jwtService = app.get(JwtService);

    // Setup: Crea utente paziente e medico
    const patientUser = await dataSource.query(`INSERT INTO "user" (email, "firstName", "lastName", "fiscalCode", role, "isActive", password) VALUES ('patient@test.com', 'Patient', 'User', 'PATIENTCF1234567', 'patient', true, 'hashedpassword') RETURNING id`);
    const patientId = patientUser[0].id;
    patientToken = await jwtService.signAsync({ sub: patientId, email: 'patient@test.com', role: UserRole.PATIENT });

    const doctorUser = await dataSource.query(`INSERT INTO "user" (email, "firstName", "lastName", "fiscalCode", role, "isActive", password) VALUES ('doctor@test.com', 'Doctor', 'User', 'DOCTORCF12345678', 'doctor', true, 'hashedpassword') RETURNING id`);
    const doctor = await dataSource.query(`INSERT INTO "doctor" ("specialization", "registrationNumber", "clinicAddress", "user_id") VALUES ('CARDIOLOGY', '123', 'Address', '${doctorUser[0].id}') RETURNING id`);
    doctorId = doctor[0].id;
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM "booking"');
    await dataSource.query('DELETE FROM "doctor"');
    await dataSource.query('DELETE FROM "user"');
    await app.close();
  });

  describe('GET /booking/availability/:doctorId/:date', () => {
    it('should return available slots', async () => {
      return request(app.getHttpServer())
        .get(`/booking/availability/${doctorId}/2026-06-01`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('POST /booking', () => {
    it('should fail without authorization', async () => {
      return request(app.getHttpServer())
        .post('/booking')
        .send({ doctorId, startTime: '2026-06-01T09:00:00Z', endTime: '2026-06-01T09:30:00Z' })
        .expect(401);
    });
  });
});
