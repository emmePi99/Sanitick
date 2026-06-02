import { Entity, Column, ManyToOne, Exclusion, JoinColumn } from 'typeorm';
import { User } from '../../../user/entity/user/user.entity';
import { Doctor } from '../../../doctor/entity/doctor/doctor.entity';
import { BookingStatus } from '@shared';
import { BaseEntity } from 'src/modules/shared/entity/base-entity.entity';

@Entity('booking')
@Exclusion(
  `USING gist ("doctor_id" WITH =, tsrange("startTime", "endTime") WITH &&)`,
)
export class Booking extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @Column({ name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;
}
