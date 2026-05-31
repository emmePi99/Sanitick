import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Il token deve essere una stringa valida' })
  @IsNotEmpty({ message: 'Il token di attivazione è obbligatorio' })
  token: string;

  @IsString({ message: 'La password deve essere una stringa valida' })
  @MinLength(8, { message: 'La password deve contenere almeno 8 caratteri' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'La password è troppo debole. Deve contenere almeno una maiuscola, una minuscola, un numero e un carattere speciale' }
  )
  password: string;
}