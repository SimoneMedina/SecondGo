export class ProductoEntity {
  id_producto: string;
  nombre_producto: string;
  descripcion_producto: string;
  fecha_publicacion_producto: Date;
  color_producto: string;
  talla_producto?: string;
  fotos?: string[];
  estado_producto: string;
  usuario_tienda: string;
}
