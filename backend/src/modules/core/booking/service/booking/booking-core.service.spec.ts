import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingCoreService } from 'src/modules/core/booking/service/booking/booking-core.service';
import { Booking } from 'src/modules/core/booking/entity/booking/booking.entity';
import { BookingStatus } from '@shared';

describe('BookingCoreService', () => {
  let service: BookingCoreService;
  let repository: Repository<Booking>;

  const mockBooking: Partial<Booking> = {
    id: 'uuid-booking',
    status: BookingStatus.PENDING,
  };

  const mockBookingRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    metadata: {
      connection: {
        options: {
          type: 'postgres',
        },
      },
      columns: [],
      relations: [],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingCoreService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
      ],
    }).compile();

    service = module.get<BookingCoreService>(BookingCoreService);
    repository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
