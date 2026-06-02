import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/core/user/entity/user/user.entity';
import { Doctor } from '../modules/core/doctor/entity/doctor/doctor.entity';
import { Booking } from '../modules/core/booking/entity/booking/booking.entity';
import { DoctorSchedule } from 'src/modules/core/doctor-schedule/entity/doctor-schedule.entity';

dotenv.config({ path: '../.env' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5332,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging:
    process.env.DB_LOGGING === 'true'
      ? true
      : process.env.DB_LOGGING === 'all'
        ? 'all'
        : false,
  entities: [User, Doctor, Booking, DoctorSchedule],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
