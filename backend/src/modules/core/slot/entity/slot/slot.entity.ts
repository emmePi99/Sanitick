import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, VersionColumn } from 'typeorm';
import { Doctor } from '../../../doctor/entity/doctor/doctor.entity';

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column({ default: true })
  isAvailable: boolean;

  @VersionColumn()
  version: number;
}
