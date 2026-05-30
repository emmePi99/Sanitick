import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entity/doctor/doctor.entity';
import { DoctorCoreService } from './service/doctor/doctor-core.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  providers: [DoctorCoreService],
  exports: [DoctorCoreService],
})
export class DoctorCoreModule {}
