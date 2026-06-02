import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Activation or reset token' })
  @IsString({ message: 'Il token deve essere una stringa valida' })
  @IsNotEmpty({ message: 'Il token di attivazione è obbligatorio' })
  token: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description:
      'Minimum 8 characters, one uppercase, one lowercase, one number and one special character',
  })
  @IsString({ message: 'La password deve essere una stringa valida' })
  @MinLength(8, { message: 'La password deve contenere almeno 8 caratteri' })
  @Matches(/(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La password è troppo debole. Deve contenere almeno una maiuscola, una minuscola, un numero e un carattere speciale',
  })
  password: string;
}
