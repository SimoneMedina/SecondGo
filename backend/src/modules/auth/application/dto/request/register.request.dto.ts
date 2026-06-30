import { IsString, IsNumber } from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  id_usuario: string;

  @IsString()
  nombres_usuario: string;

  @IsString()
  apellidos_usuario: string;

  @IsString()
  correo_usuario: string;

  @IsString()
  contrasena_usuario: string;

  @IsNumber()
  ubicacion_usuario: number;
}
