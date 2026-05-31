import { Module } from '@nestjs/common';
import { AvailabilityService } from './service/availability.service';
import { BookingCoreModule } from '../../core/booking/booking-core.module';
import { DoctorScheduleModule } from '../../core/doctor-schedule/doctor-schedule.module';

@Module({
  imports: [
    BookingCoreModule,
    DoctorScheduleModule,
  ],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class BookingModule {}
