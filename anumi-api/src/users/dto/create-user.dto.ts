import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'El nombre de usuario debe ser texto',
  })
  @IsNotEmpty({
    message: 'El nombre de usuario es obligatorio',
  })
  @Length(4, 30, {
    message: 'El nombre de usuario debe tener entre 4 y 30 caracteres',
  })
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message:
      'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos',
  })
  username!: string;

  @IsString({
    message: 'El correo electrónico debe ser texto',
  })
  @IsNotEmpty({
    message: 'El correo electrónico es obligatorio',
  })
  @IsEmail(
    {},
    {
      message: 'El correo electrónico no tiene un formato válido',
    },
  )
  @MaxLength(191, {
    message: 'El correo electrónico no puede exceder 191 caracteres',
  })
  email!: string;

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
  @Matches(/[a-z]/, {
    message: 'La contraseña debe contener al menos una letra minúscula',
  })
  @Matches(/[A-Z]/, {
    message: 'La contraseña debe contener al menos una letra mayúscula',
  })
  @Matches(/[0-9]/, {
    message: 'La contraseña debe contener al menos un número',
  })
  password!: string;
}
