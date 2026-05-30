import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entity/booking/booking.entity';
import { BookingCoreService } from './service/booking/booking-core.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingCoreService],
  exports: [BookingCoreService],
})
export class BookingCoreModule {}
