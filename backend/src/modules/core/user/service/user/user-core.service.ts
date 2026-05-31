import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/user/user.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UserRole } from '@shared/index';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../../event/user-created.event';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class UserCoreService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2
  ) {
    super(userRepository);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    this.eventEmitter.emitAsync(
      UserCreatedEvent.KEY, 
      new UserCreatedEvent(savedUser.email, savedUser.activationToken)
    );
    return savedUser;
  }

  async findOneByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email, isActive: true},
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        firstName: true,
        lastName: true
      } 
    });
  }
  
  async update(id: string, data: Partial<User>): Promise<UpdateResult> {
    return await this.repo.update(id, data);
  }
}
