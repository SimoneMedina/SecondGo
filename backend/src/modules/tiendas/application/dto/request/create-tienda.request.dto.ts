import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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

  @Type(() => Number)
  @IsNumber()
  latitud_tienda: number;

  @Type(() => Number)
  @IsNumber()
  longitud_tienda: number;
}