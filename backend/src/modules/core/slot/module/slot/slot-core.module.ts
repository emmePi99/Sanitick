import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from '../../entity/slot/slot.entity';
import { SlotCoreService } from '../../service/slot/slot-core.service';

@Module({
  imports: [TypeOrmModule.forFeature([Slot])],
  providers: [SlotCoreService],
  exports: [SlotCoreService],
})
export class SlotCoreModule {}
