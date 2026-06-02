import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { DoctorSpecialization } from '@shared';
import { User } from 'src/modules/core/user/entity/user/user.entity';
import { Booking } from 'src/modules/core/booking/entity/booking/booking.entity';
import { DoctorSchedule } from 'src/modules/core/doctor-schedule/entity/doctor-schedule.entity';
import { BaseEntity } from 'src/modules/shared/entity/base-entity.entity';

@Entity('doctor')
export class Doctor extends BaseEntity {
  @Column({
    type: 'enum',
    enum: DoctorSpecialization,
    default: DoctorSpecialization.GENERAL_PRACTICE,
  })
  specialization: DoctorSpecialization;

  @Column({ unique: true })
  registrationNumber: string;

  @Column()
  clinicAddress: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToMany(() => DoctorSchedule, (schedule) => schedule.doctor, {
    cascade: true,
  })
  schedules: DoctorSchedule[];

  @OneToMany(() => Booking, (booking) => booking.doctor)
  bookings: Booking[];
}
