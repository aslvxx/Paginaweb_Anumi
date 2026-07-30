import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString({
    message: 'El token debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El token es obligatorio',
  })
  @Length(64, 64, {
    message: 'El token debe tener exactamente 64 caracteres',
  })
  @Matches(/^[a-f0-9]+$/i, {
    message: 'El token tiene un formato inválido',
  })
  token!: string;

  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La contraseña es obligatoria',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  @MaxLength(72, {
    message: 'La contraseña no puede superar los 72 caracteres',
  })
  password!: string;
}
