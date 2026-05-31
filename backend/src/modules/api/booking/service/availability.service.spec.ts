import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityService } from './availability.service';
import { BookingCoreService } from '../../../core/booking/service/booking/booking-core.service';
import { DoctorScheduleCoreService } from '../../../core/doctor-schedule/service/doctor-schedule-core/doctor-schedule-core.service';
import dayjs from 'dayjs';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let bookingCoreService: BookingCoreService;
  let doctorScheduleCoreService: DoctorScheduleCoreService;

  const mockBookingCoreService = {
    findByDoctorAndDate: jest.fn(),
  };

  const mockDoctorScheduleCoreService = {
    findByDoctorAndDay: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        { provide: BookingCoreService, useValue: mockBookingCoreService },
        { provide: DoctorScheduleCoreService, useValue: mockDoctorScheduleCoreService },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    bookingCoreService = module.get<BookingCoreService>(BookingCoreService);
    doctorScheduleCoreService = module.get<DoctorScheduleCoreService>(DoctorScheduleCoreService);
    jest.clearAllMocks();
  });

  it('should return all slots when no bookings exist', async () => {
    mockDoctorScheduleCoreService.findByDoctorAndDay.mockResolvedValue([
      { startTime: '09:00', endTime: '11:00' }
    ]);
    mockBookingCoreService.findByDoctorAndDate.mockResolvedValue([]);

    const result = await service.getAvailableSlots('doc1', '2026-06-01', 30);
    expect(result).toEqual(['09:00', '09:30', '10:00', '10:30']);
  });

  it('should exclude occupied slots', async () => {
    mockDoctorScheduleCoreService.findByDoctorAndDay.mockResolvedValue([
      { startTime: '09:00', endTime: '11:00' }
    ]);
    mockBookingCoreService.findByDoctorAndDate.mockResolvedValue([
      { startTime: new Date('2026-06-01T09:30:00'), endTime: new Date('2026-06-01T10:00:00') }
    ]);

    const result = await service.getAvailableSlots('doc1', '2026-06-01', 30);
    expect(result).toEqual(['09:00', '10:00', '10:30']);
  });
});
