import { ProductoOrmEntity } from '../../infrastructure/persistence/typeorm/producto.orm-entity';
import { ProductoEntity } from '../../domain/entities/producto.entity';
import { ProductoResponseDto } from '../dto/response/producto.response.dto';

export class ProductoMapper {
  static ormToEntity(orm: ProductoOrmEntity): ProductoEntity {
    return {
      id_producto: orm.id_producto,
      nombre_producto: orm.nombre_producto,
      descripcion_producto: orm.descripcion_producto,
      color_producto: orm.color_producto,
      hex_color: orm.hex_color,
      grupo_color: orm.grupo_color,
      tipo_prenda: orm.tipo_prenda,
      estilo_producto: orm.estilo_producto,
      talla_producto: orm.talla_producto,
      estado_producto: orm.estado_producto,
      usuario_tienda: orm.usuario_tienda,
    };
  }

  static ormToResponse(orm: ProductoOrmEntity): ProductoResponseDto {
    return {
      id: orm.id_producto,
      nombre: orm.nombre_producto,
      descripcion: orm.descripcion_producto,
      fechaPublicacion: orm.fecha_publicacion_producto,
      color: orm.color_producto,
      hexColor: orm.hex_color,
      grupoColor: orm.grupo_color,
      tipoPrenda: orm.tipo_prenda,
      estilo: orm.estilo_producto,
      talla: orm.talla_producto,
      estado: orm.estado_producto,
      usuarioTienda: orm.usuario_tienda,
      tiendaId: orm.usuario_tienda,
      tiendaNombre: orm.Tienda?.nombre_local,
      compradorSolicitanteId: orm.id_comprador_solicitante,
      fotos: orm.Fotos?.map((foto) => foto.url_foto) ?? [],
    };
  }
}