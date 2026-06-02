import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../entity/doctor/doctor.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { CreateDoctorDto } from 'src/modules/api/doctor/dto/create-doctor.dto';
import { DoctorCreatedEvent } from 'src/modules/core/doctor/events/doctor-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailOrCfConflictException } from 'src/modules/api/auth/exception/mail-or-cf-conflict.exception';
import {
  bildActivationTokenAndTokenExpires,
  buildAlreadyExistingUserFindOptionsWhere,
} from 'src/modules/core/user/util/user.util';
import { UserRole } from '@shared/index';

@Injectable()
export class DoctorCoreService extends TypeOrmCrudService<Doctor> {
  private readonly logger = new Logger(DoctorCoreService.name);

  constructor(
    @InjectRepository(Doctor)
    protected readonly doctorRepository: Repository<Doctor>,
    private eventEmitter: EventEmitter2,
  ) {
    super(doctorRepository);
  }

  async createDoctorWithUser(dto: CreateDoctorDto): Promise<void> {
    const alreadyExisistingUserFIndOptionsWhere =
      buildAlreadyExistingUserFindOptionsWhere(dto.email, dto.fiscalCode);
    const alreadySavedDoctor = await this.doctorRepository.findOneBy({
      user: alreadyExisistingUserFIndOptionsWhere,
    });

    if (alreadySavedDoctor) {
      throw new MailOrCfConflictException();
    }

    const savedDoctor = await this.doctorRepository.save({
      specialization: dto.specialization,
      clinicAddress: dto.clinicAddress,
      registrationNumber: dto.registrationNumber,
      user: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        fiscalCode: dto.fiscalCode,
        role: UserRole.DOCTOR,
        ...bildActivationTokenAndTokenExpires(),
      },
    });

    await this.eventEmitter.emitAsync(
      DoctorCreatedEvent.KEY,
      new DoctorCreatedEvent(
        savedDoctor.user.email,
        savedDoctor.user.firstName,
        savedDoctor.user.lastName,
        savedDoctor.user.activationToken,
      ),
    );
  }
}
