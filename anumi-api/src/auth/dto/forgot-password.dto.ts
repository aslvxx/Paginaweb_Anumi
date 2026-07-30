import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsString({
    message: 'El correo debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El correo es obligatorio',
  })
  @IsEmail(
    {},
    {
      message: 'El correo no tiene un formato válido',
    },
  )
  @MaxLength(254, {
    message: 'El correo no puede superar los 254 caracteres',
  })
  email!: string;
}
