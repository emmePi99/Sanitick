import { DoctorSpecialization } from '@shared/index';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterDto } from '../../auth/dto/auth/register.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto extends RegisterDto {
  // --- DATI MEDICO ---

  @ApiProperty({
    enum: DoctorSpecialization,
    example: DoctorSpecialization.CARDIOLOGY,
  })
  @IsString()
  @IsNotEmpty({ message: 'La specializzazione è obbligatoria' })
  specialization: DoctorSpecialization;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({
    message: "Il numero di registrazione all'albo (Matricola) è obbligatorio",
  })
  registrationNumber: string;

  @ApiProperty({ example: 'Via Roma 123, Milano' })
  @IsString()
  @IsNotEmpty({ message: "L'indirizzo dello studio/clinica è obbligatorio" })
  clinicAddress: string;
}
