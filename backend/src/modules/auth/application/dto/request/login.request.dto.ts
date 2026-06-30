import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  correo: string;

  @IsString()
  password: string;
}
