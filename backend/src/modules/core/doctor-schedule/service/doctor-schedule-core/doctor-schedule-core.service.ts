import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Repository } from 'typeorm';
import { DoctorSchedule } from '../../entity/doctor-schedule.entity';

@Injectable()
export class DoctorScheduleCoreService extends TypeOrmCrudService<DoctorSchedule> {
  constructor(
    @InjectRepository(DoctorSchedule) repo: Repository<DoctorSchedule>
  ) {
    super(repo);
  }
}