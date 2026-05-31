import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole, DoctorSpecialization } from '@shared';
import { DataSource } from 'typeorm';
import { MailerService } from '../src/modules/core/mailer/service/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';

describe('DoctorController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let adminToken: string;

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
    jwtService = app.get(JwtService);

    // Crea un admin per autenticarsi
    const adminUser = await dataSource.query(`INSERT INTO "user" (email, "firstName", "lastName", "fiscalCode", role, "isActive", password) VALUES ('admin@test.com', 'Admin', 'User', 'ADMINCF123456789', 'admin', true, 'hashedpassword') RETURNING id`);
    const adminId = adminUser[0].id;
    
    adminToken = await jwtService.signAsync({ sub: adminId, email: 'admin@test.com', role: UserRole.ADMIN });
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM "user"');
    await app.close();
  });

  describe('POST /doctor', () => {
    it('should create a doctor with valid admin token', () => {
      const doctorData = {
        email: 'doctor@test.com',
        firstName: 'Doctor',
        lastName: 'Test',
        fiscalCode: 'RSSMRA80A01H501W',
        specialization: DoctorSpecialization.CARDIOLOGY,
        clinicAddress: 'Via Roma 1',
        registrationNumber: '12345',
      };

      return request(app.getHttpServer())
        .post('/doctor')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(doctorData)
        .expect(201);
    });

    it('should fail without authorization', () => {
      const doctorData = {
        email: 'doctor2@test.com',
        firstName: 'Doctor',
        lastName: 'Test',
        fiscalCode: 'RSSMRA80A01H501Z', 
        specialization: DoctorSpecialization.CARDIOLOGY,
        clinicAddress: 'Via Roma 1',
        registrationNumber: '123456',
      };
      return request(app.getHttpServer())
        .post('/doctor')
        .send(doctorData)
        .expect(401);
    });
  });
});
