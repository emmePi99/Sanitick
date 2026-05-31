import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from '../../entity/booking/booking.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import dayjs from 'dayjs';
import { CreateBookingDto } from 'src/modules/api/booking/dto/create-booking.dto';

@Injectable()
export class BookingCoreService extends TypeOrmCrudService<Booking> {
  constructor(
    @InjectRepository(Booking) protected readonly repo: Repository<Booking>,
  ) {
    super(repo);
  }

  async findByDoctorAndDate(doctorId: string, date: Date): Promise<Booking[]> {
    const startOfDay = dayjs(date).startOf('day').toDate();
    const endOfDay = dayjs(date).endOf('day').toDate();
    return this.repo.find({ 
        where: { 
            doctor: { id: doctorId },
            startTime: Between(startOfDay, endOfDay) 
        } 
    });
  }

  async createBooking(bookingData: CreateBookingDto, patientId: string): Promise<Booking> {
    return this.repo.save({ ...bookingData, patientId });
  }
}
