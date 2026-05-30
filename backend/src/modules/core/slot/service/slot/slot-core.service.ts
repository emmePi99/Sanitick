import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from '../../entity/slot/slot.entity';

@Injectable()
export class SlotCoreService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
  ) {}

  async findOneById(id: string): Promise<Slot | null> {
    return this.slotRepository.findOne({ 
      where: { id }, 
      relations: { 
        doctor: { 
          user: true 
        } 
      } 
    });
  }

  async create(slotData: Partial<Slot>): Promise<Slot> {
    const slot = this.slotRepository.create(slotData);
    return this.slotRepository.save(slot);
  }

  async update(id: string, slotData: Partial<Slot>): Promise<Slot | null> {
    const slot = await this.slotRepository.preload({ id, ...slotData });
    if (!slot) return null;
    return this.slotRepository.save(slot);
  }
}
