import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../entity/booking/booking.entity';

@Injectable()
export class BookingCoreService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async findOneById(id: string): Promise<Booking | null> {
    return this.bookingRepository.findOne({ 
      where: { id }, 
      relations: { 
        patient: true, 
        slot: { 
          doctor: true 
        } 
      } 
    });
  }

  async create(bookingData: Partial<Booking>): Promise<Booking> {
    const booking = this.bookingRepository.create(bookingData);
    return this.bookingRepository.save(booking);
  }

  async update(id: string, bookingData: Partial<Booking>): Promise<Booking | null> {
    await this.bookingRepository.update(id, bookingData);
    return this.findOneById(id);
  }
}
