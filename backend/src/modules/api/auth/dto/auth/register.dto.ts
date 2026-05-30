import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from '@shared';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(16, 16, { message: 'Il codice fiscale deve essere esattamente di 16 caratteri' })
  @Matches(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i, {
    message: 'Il formato del codice fiscale non è valido',
  })
  fiscalCode: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
