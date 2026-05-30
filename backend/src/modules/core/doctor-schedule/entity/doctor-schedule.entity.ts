import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { Doctor } from '../../doctor/entity/doctor/doctor.entity';

@Entity('doctor_schedule')
export class DoctorSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relazione verso il medico a cui appartiene questa regola oraria
  @ManyToOne(() => Doctor, (doctor) => doctor.schedules, { onDelete: 'CASCADE' })
  doctor: Doctor;

  // Giorno della settimana: 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato (standard JavaScript/PostgreSQL)
  @Column({ type: 'int' })
  dayOfWeek: number;

  // Orario di inizio turno (es. "09:00:00")
  @Column({ type: 'time' })
  startTime: string;

  // Orario di fine turno (es. "13:00:00")
  @Column({ type: 'time' })
  endTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}