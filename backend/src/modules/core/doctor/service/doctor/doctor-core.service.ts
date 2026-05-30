import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../entity/doctor/doctor.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

@Injectable()
export class DoctorCoreService extends TypeOrmCrudService<Doctor> {
  constructor(
    @InjectRepository(Doctor) protected readonly doctorRepository: Repository<Doctor>,
  ) {
    super(doctorRepository);
  }
}
