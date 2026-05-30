import { Test, TestingModule } from '@nestjs/testing';
import { DoctorScheduleCoreService } from './doctor-schedule-core.service';

describe('DoctorScheduleCoreService', () => {
  let service: DoctorScheduleCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorScheduleCoreService],
    }).compile();

    service = module.get<DoctorScheduleCoreService>(DoctorScheduleCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
