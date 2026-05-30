import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../entity/doctor/doctor.entity';

@Injectable()
export class DoctorCoreService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async findOneById(id: string): Promise<Doctor | null> {
    return this.doctorRepository.findOne({ where: { id }, relations: { user: true } });
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({ relations: { user: true } });
  }

  async create(doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.doctorRepository.create(doctorData);
    return this.doctorRepository.save(doctor);
  }

  async update(id: string, doctorData: Partial<Doctor>): Promise<Doctor | null> {
    await this.doctorRepository.update(id, doctorData);
    return this.findOneById(id);
  }
}
