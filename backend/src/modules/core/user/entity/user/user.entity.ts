import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { UserRole } from '@shared';
import { bildActivationTokenAndTokenExpires } from '../../util/user.util';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  // Resa nullable per permettere la creazione del profilo tramite invito (es. Medico)
  @Column({ select: false, nullable: true })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ 
    length: 16, 
    unique: true 
  })
  fiscalCode: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  activationToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  activationTokenExpires: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateActivationToken() {
    const tokenAndExpires = bildActivationTokenAndTokenExpires();
    this.activationToken = tokenAndExpires.activationToken;
    this.activationTokenExpires = tokenAndExpires.activationTokenExpires;
  }
}