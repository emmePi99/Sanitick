import { Module } from '@nestjs/common';
import { DoctorController } from './controller/doctor/doctor.controller';
import { DoctorCoreModule } from 'src/modules/core/doctor/doctor-core.module';

@Module({
  imports: [DoctorCoreModule],
  controllers: [DoctorController],
})
export class DoctorModule {}
