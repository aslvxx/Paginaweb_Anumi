import { IsBoolean } from 'class-validator';

export class UpdateUserStatusDto {
  @IsBoolean({
    message: 'isActive debe ser un valor booleano',
  })
  isActive!: boolean;
}
