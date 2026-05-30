import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne, 
  JoinColumn, 
  OneToMany, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { DoctorSpecialization } from '@shared';
import { User } from 'src/modules/core/user/entity/user/user.entity';
import { Booking } from 'src/modules/core/booking/entity/booking/booking.entity';
import { DoctorSchedule } from 'src/modules/core/doctor-schedule/entity/doctor-schedule.entity';

@Entity('doctor')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DoctorSpecialization,
    default: DoctorSpecialization.GENERAL_PRACTICE
  })
  specialization: DoctorSpecialization;

  @Column({ unique: true })
  registrationNumber: string;

  @Column()
  clinicAddress: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  // Relazione con i template settimanali degli orari di lavoro
  @OneToMany(() => DoctorSchedule, (schedule) => schedule.doctor, {
    cascade: true,
  })
  schedules: DoctorSchedule[];

  // Relazione con le prenotazioni effettive dei pazienti
  @OneToMany(() => Booking, (booking) => booking.doctor)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}