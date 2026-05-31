import { Test, TestingModule } from '@nestjs/testing';
import { DoctorScheduleCoreService } from 'src/modules/core/doctor-schedule/service/doctor-schedule-core/doctor-schedule-core.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DoctorSchedule } from 'src/modules/core/doctor-schedule/entity/doctor-schedule.entity';

describe('DoctorScheduleCoreService', () => {
  let service: DoctorScheduleCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorScheduleCoreService,
        {
          provide: getRepositoryToken(DoctorSchedule),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            metadata: {
              connection: {
                options: {
                  type: 'postgres',
                },
              },
              columns: [],
              relations: [],
            },
          },
        },
      ],
    }).compile();

    service = module.get<DoctorScheduleCoreService>(DoctorScheduleCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
