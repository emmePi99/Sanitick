import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Repository } from 'typeorm';
import { DoctorSchedule } from '../../entity/doctor-schedule.entity';

@Injectable()
export class DoctorScheduleCoreService extends TypeOrmCrudService<DoctorSchedule> {
  constructor(
    @InjectRepository(DoctorSchedule)
    protected readonly repo: Repository<DoctorSchedule>,
  ) {
    super(repo);
  }

  async findByDoctorAndDay(
    doctorId: string,
    dayOfWeek: number,
  ): Promise<DoctorSchedule[]> {
    return this.repo.find({ where: { doctor: { id: doctorId }, dayOfWeek } });
  }
}
