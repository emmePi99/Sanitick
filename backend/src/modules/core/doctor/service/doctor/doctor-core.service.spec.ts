import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorCoreService } from 'src/modules/core/doctor/service/doctor/doctor-core.service';
import { Doctor } from 'src/modules/core/doctor/entity/doctor/doctor.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('DoctorCoreService', () => {
  let service: DoctorCoreService;
  let repository: Repository<Doctor>;

  const mockDoctor: Partial<Doctor> = {
    id: 'uuid-doc',
    specialization: 'Cardiology',
    registrationNumber: '12345',
  };

  const mockDoctorRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
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
        DoctorCoreService,
        {
          provide: getRepositoryToken(Doctor),
          useValue: mockDoctorRepository,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
            emitAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DoctorCoreService>(DoctorCoreService);
    repository = module.get<Repository<Doctor>>(getRepositoryToken(Doctor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return a doctor if found', async () => {
      mockDoctorRepository.findOne.mockResolvedValue(mockDoctor);
      const result = await service.findOne({ where: { id: 'uuid-doc' }, relations: { user: true } });
      expect(result).toEqual(mockDoctor);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-doc' }, relations: { user: true } });
    });
  });
});
