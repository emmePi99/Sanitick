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
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  entities: [User, Doctor, Booking, DoctorSchedule],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
