import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTiendaRequestDto {
  @IsString()
  @IsNotEmpty()
  nombre_local: string;

  @IsString()
  @IsNotEmpty()
  descripcion_tienda: string;

  @IsString()
  @IsNotEmpty()
  ubicacion_tienda: string;
}
