import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/core/user/entity/user/user.entity';
import { Doctor } from './modules/core/doctor/entity/doctor/doctor.entity';
import { Booking } from './modules/core/booking/entity/booking/booking.entity';
import { AuthModule } from './modules/api/auth/auth.module';
import { DoctorScheduleModule } from './modules/core/doctor-schedule/doctor-schedule.module';
import { BookingCoreModule } from './modules/core/booking/booking-core.module';
import { DoctorCoreModule } from './modules/core/doctor/doctor-core.module';
import { UserCoreModule } from './modules/core/user/user-core.module';
import { DoctorSchedule } from './modules/core/doctor-schedule/entity/doctor-schedule.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from './modules/core/mailer/mailer.module';
import { DoctorModule } from './modules/api/doctor/doctor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5332,
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [User, Doctor, Booking, DoctorSchedule],
        synchronize: false,
        logging: true,
      }),
    }),
    EventEmitterModule.forRoot(),
    UserCoreModule,
    DoctorCoreModule,
    BookingCoreModule,
    AuthModule,
    DoctorScheduleModule,
    MailerModule,
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
