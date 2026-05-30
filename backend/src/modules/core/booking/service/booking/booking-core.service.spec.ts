import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingCoreService } from './booking-core.service';
import { Booking } from '../../entity/booking/booking.entity';
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

  describe('create', () => {
    it('should create and save a booking', async () => {
      mockBookingRepository.create.mockReturnValue(mockBooking);
      mockBookingRepository.save.mockResolvedValue(mockBooking);
      
      const result = await service.create({});
      
      expect(result).toEqual(mockBooking);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });
});
