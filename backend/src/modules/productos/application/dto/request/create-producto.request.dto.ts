import { IsIn, IsString, IsOptional } from 'class-validator';

export const TALLAS_PRODUCTO = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;
export type TallaProducto = (typeof TALLAS_PRODUCTO)[number];

export class CreateProductoRequestDto {
  @IsString()
  nombre_producto: string;

  @IsString()
  descripcion_producto: string;

  @IsString()
  color_producto: string;

  @IsOptional()
  @IsIn(TALLAS_PRODUCTO)
  talla_producto?: TallaProducto;

  @IsString()
  estado_producto: string;
}
