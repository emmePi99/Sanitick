import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'mario.rossi@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Mario' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Rossi' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'RSSMRA80A01H501W' })
  @IsString()
  @IsNotEmpty()
  @Length(16, 16, {
    message: 'Il codice fiscale deve essere esattamente di 16 caratteri',
  })
  @Matches(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i, {
    message: 'Il formato del codice fiscale non è valido',
  })
  fiscalCode: string;
}
