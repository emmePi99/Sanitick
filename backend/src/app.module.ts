import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/core/user/entity/user/user.entity';
import { Doctor } from './modules/core/doctor/entity/doctor/doctor.entity';
import { Slot } from './modules/core/slot/entity/slot/slot.entity';
import { Booking } from './modules/core/booking/entity/booking/booking.entity';
import { UserCoreModule } from './modules/core/user/module/user/user-core.module';
import { DoctorCoreModule } from './modules/core/doctor/module/doctor/doctor-core.module';
import { SlotCoreModule } from './modules/core/slot/module/slot/slot-core.module';
import { BookingCoreModule } from './modules/core/booking/module/booking/booking-core.module';
import { AuthModule } from './modules/api/auth/module/auth/auth-api.module';

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
        entities: [User, Doctor, Slot, Booking],
        synchronize: false,
        logging: true,
      }),
    }),
    UserCoreModule,
    DoctorCoreModule,
    SlotCoreModule,
    BookingCoreModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
