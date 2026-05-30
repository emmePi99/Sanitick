import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/user/user.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UserRole } from '@shared/index';

@Injectable()
export class UserCoreService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findOneByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
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
}
