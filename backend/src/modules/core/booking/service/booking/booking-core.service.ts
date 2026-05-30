import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../entity/booking/booking.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

@Injectable()
export class BookingCoreService extends TypeOrmCrudService<Booking> {
  constructor(
    @InjectRepository(Booking) protected readonly repo: Repository<Booking>,
  ) {
    super(repo);
  }
}
