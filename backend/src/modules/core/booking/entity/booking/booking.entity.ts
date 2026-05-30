import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn,
  Exclusion 
} from 'typeorm';
import { User } from '../../../user/entity/user/user.entity';
// Importa l'entità Doctor (assicurati che il percorso sia corretto)
import { Doctor } from '../../../doctor/entity/doctor/doctor.entity'; 
import { BookingStatus } from '@shared';

@Entity('booking')
// 🚀 Il cuore dell'anti-overbooking: il vincolo EXCLUDE di PostgreSQL
@Exclusion(`USING gist ("doctorId" WITH =, tsrange("startTime", "endTime") WITH &&)`)
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  patient: User;

  // Nuova relazione: colleghiamo la prenotazione direttamente al medico
  @ManyToOne(() => Doctor, (doctor) => doctor.bookings, { onDelete: 'CASCADE' })
  doctor: Doctor;

  // I limiti temporali effettivi della visita (sostituiscono lo Slot)
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}