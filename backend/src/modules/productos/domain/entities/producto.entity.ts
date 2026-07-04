export class ProductoEntity {
  id_producto: string;
  nombre_producto: string;
  descripcion_producto: string;
  color_producto: string;
  hex_color?: string | null;
  grupo_color?: string | null;
  tipo_prenda?: string | null;
  estilo_producto?: string | null;
  talla_producto?: string | null;
  estado_producto: string;
  usuario_tienda: string;
}