import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export type TipoUsuario = 'comprador' | 'vendedor';

export class RegisterRequestDto {
  @IsString()
  nombres_usuario: string;

  @IsString()
  apellidos_usuario: string;

  @IsString()
  correo_usuario: string;

  @IsString()
  contrasena_usuario: string;

  @IsNumber()
  latitud: number;

  @IsNumber()
  longitud: number;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsIn(['comprador', 'vendedor'])
  tipo_usuario: TipoUsuario;
}