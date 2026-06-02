import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingCoreService } from 'src/modules/core/booking/service/booking/booking-core.service';
import { Booking } from 'src/modules/core/booking/entity/booking/booking.entity';

describe('BookingCoreService', () => {
  let service: BookingCoreService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
