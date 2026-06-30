export class CreateProductoRequestDto {
  nombre_producto: string;
  descripcion_producto: string;
  color_producto: string;
  talla_producto?: string;
  dimensiones_producto: string;
  estado_producto: string;
  foto_producto?: Buffer;
}
