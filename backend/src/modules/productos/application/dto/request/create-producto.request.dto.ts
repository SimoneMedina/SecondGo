import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const TALLAS_PRODUCTO = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
] as const;

export type TallaProducto = (typeof TALLAS_PRODUCTO)[number];

export class CreateProductoRequestDto {
  @IsString()
  @IsNotEmpty()
  nombre_producto: string;

  @IsString()
  @IsNotEmpty()
  descripcion_producto: string;

  @IsString()
  @IsNotEmpty()
  color_producto: string;

  @IsString()
  @IsOptional()
  hex_color?: string;

  @IsString()
  @IsOptional()
  grupo_color?: string;

  @IsString()
  @IsOptional()
  tipo_prenda?: string;

  @IsString()
  @IsOptional()
  estilo_producto?: string;

  @IsOptional()
  @IsIn(TALLAS_PRODUCTO)
  talla_producto?: TallaProducto;

  @IsString()
  @IsNotEmpty()
  estado_producto: string;
}