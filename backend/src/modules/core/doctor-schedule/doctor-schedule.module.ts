import { Module } from '@nestjs/common';
import { DoctorScheduleCoreService } from './service/doctor-schedule-core/doctor-schedule-core.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedule } from './entity/doctor-schedule.entity';

@Module({
  providers: [DoctorScheduleCoreService],
  imports: [TypeOrmModule.forFeature([DoctorSchedule])],
  exports: [DoctorScheduleCoreService],
})
export class DoctorScheduleModule {}
