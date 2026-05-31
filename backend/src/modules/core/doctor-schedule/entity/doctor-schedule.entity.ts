import { 
  Entity, 
  Column, 
  ManyToOne
} from 'typeorm';
import { Doctor } from '../../doctor/entity/doctor/doctor.entity';
import { BaseEntity } from 'src/modules/shared/entity/base-entity.entity';

@Entity('doctor_schedule')
export class DoctorSchedule extends BaseEntity {
  @ManyToOne(() => Doctor, (doctor) => doctor.schedules, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column({ type: 'int' })
  dayOfWeek: number;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;
}