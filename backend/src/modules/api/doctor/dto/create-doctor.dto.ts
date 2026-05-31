import { DoctorSpecialization } from '@shared/index';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterDto } from '../../auth/dto/auth/register.dto';

export class CreateDoctorDto extends RegisterDto {
  // --- DATI MEDICO ---

  @IsString()
  @IsNotEmpty({ message: 'La specializzazione è obbligatoria' })
  specialization: DoctorSpecialization;

  @IsString()
  @IsNotEmpty({ message: 'Il numero di registrazione all\'albo (Matricola) è obbligatorio' })
  registrationNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'L\'indirizzo dello studio/clinica è obbligatorio' })
  clinicAddress: string;
}