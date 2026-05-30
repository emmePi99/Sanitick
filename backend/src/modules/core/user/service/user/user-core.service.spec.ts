import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCoreService } from './user-core.service';
import { User } from '../../entity/user/user.entity';
import { UserRole } from '@shared';

describe('UserCoreService', () => {
  let service: UserCoreService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 'uuid',
    email: 'test@example.com',
    password: 'hashedpassword',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.PATIENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCoreService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserCoreService>(UserCoreService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return a user if found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOneById('uuid');
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid' } });
    });
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      
      const result = await service.create({ email: 'test@example.com' });
      
      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
