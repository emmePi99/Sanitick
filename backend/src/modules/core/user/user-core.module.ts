import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user/user.entity';
import { UserCoreService } from './service/user/user-core.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserCoreService],
  exports: [UserCoreService],
})
export class UserCoreModule {}
