import { IsIn, IsString } from 'class-validator';

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

  @IsIn(['comprador', 'vendedor'])
  tipo_usuario: TipoUsuario;
}