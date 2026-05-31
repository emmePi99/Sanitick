import { Test, TestingModule } from '@nestjs/testing';
import { DoctorController } from 'src/modules/api/doctor/controller/doctor/doctor.controller';
import { DoctorCoreService } from 'src/modules/core/doctor/service/doctor/doctor-core.service';

describe('DoctorController', () => {
  let controller: DoctorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorController],
      providers: [
        {
          provide: DoctorCoreService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DoctorController>(DoctorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
