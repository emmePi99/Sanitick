import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlotCoreService } from './slot-core.service';
import { Slot } from '../../entity/slot/slot.entity';

describe('SlotCoreService', () => {
  let service: SlotCoreService;
  let repository: Repository<Slot>;

  const mockSlot: Partial<Slot> = {
    id: 'uuid-slot',
    isAvailable: true,
    version: 1,
  };

  const mockSlotRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotCoreService,
        {
          provide: getRepositoryToken(Slot),
          useValue: mockSlotRepository,
        },
      ],
    }).compile();

    service = module.get<SlotCoreService>(SlotCoreService);
    repository = module.get<Repository<Slot>>(getRepositoryToken(Slot));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should use preload and save for optimistic locking', async () => {
      mockSlotRepository.preload.mockResolvedValue(mockSlot);
      mockSlotRepository.save.mockResolvedValue({ ...mockSlot, isAvailable: false });
      
      const result = await service.update('uuid-slot', { isAvailable: false });
      
      expect(result?.isAvailable).toBe(false);
      expect(repository.preload).toHaveBeenCalledWith({ id: 'uuid-slot', isAvailable: false });
      expect(repository.save).toHaveBeenCalled();
    });
  });
});
