import { IsIn, IsOptional } from 'class-validator';
import { TALLAS_PRODUCTO, TallaProducto } from './create-producto.request.dto';

export class UpdateProductoRequestDto {
  nombre_producto?: string;
  descripcion_producto?: string;
  color_producto?: string;

  @IsOptional()
  @IsIn(TALLAS_PRODUCTO)
  talla_producto?: TallaProducto;

  estado_producto?: string;
}
