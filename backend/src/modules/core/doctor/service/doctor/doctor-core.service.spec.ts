import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorCoreService } from './doctor-core.service';
import { Doctor } from '../../entity/doctor/doctor.entity';

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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorCoreService,
        {
          provide: getRepositoryToken(Doctor),
          useValue: mockDoctorRepository,
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
      const result = await service.findOneById('uuid-doc');
      expect(result).toEqual(mockDoctor);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-doc' }, relations: { user: true } });
    });
  });
});
