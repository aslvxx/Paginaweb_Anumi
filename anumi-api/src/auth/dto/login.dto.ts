import {
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString({
    message: 'El nombre de usuario debe ser texto',
  })
  @IsNotEmpty({
    message: 'El nombre de usuario es obligatorio',
  })
  @Length(4, 30, {
    message: 'El nombre de usuario debe tener entre 4 y 30 caracteres',
  })
  username!: string;

  @IsString({
    message: 'La contraseña debe ser texto',
  })
  @IsNotEmpty({
    message: 'La contraseña es obligatoria',
  })
  @MinLength(10, {
    message: 'La contraseña debe tener al menos 10 caracteres',
  })
  @MaxLength(72, {
    message: 'La contraseña no puede exceder 72 caracteres',
  })
  password!: string;
}
