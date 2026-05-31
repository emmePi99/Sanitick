import { Module } from '@nestjs/common';
import { AvailabilityService } from './service/availability.service';
import { BookingCoreModule } from '../../core/booking/booking-core.module';
import { DoctorScheduleModule } from '../../core/doctor-schedule/doctor-schedule.module';
import { BookingController } from './controller/booking.controller';

@Module({
  imports: [
    BookingCoreModule,
    DoctorScheduleModule,
  ],
  controllers: [BookingController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class BookingModule {}
