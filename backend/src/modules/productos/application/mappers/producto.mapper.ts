import { ProductoOrmEntity } from '../../infrastructure/persistence/typeorm/producto.orm-entity';
import { ProductoEntity } from '../../domain/entities/producto.entity';
import { ProductoResponseDto } from '../dto/response/producto.response.dto';

export class ProductoMapper {
  static ormToEntity(orm: ProductoOrmEntity): ProductoEntity {
    return {
      id_producto: orm.id_producto,
      nombre_producto: orm.nombre_producto,
      descripcion_producto: orm.descripcion_producto,
      fecha_publicacion_producto: orm.fecha_publicacion_producto,
      color_producto: orm.color_producto,
      talla_producto: orm.talla_producto ?? undefined,
      fotos: orm.Fotos?.map((foto) => foto.url_foto) ?? [],
      estado_producto: orm.estado_producto,
      usuario_tienda: orm.usuario_tienda,
    };
  }

  static entityToResponse(entity: ProductoEntity): ProductoResponseDto {
    return {
      id: entity.id_producto,
      nombre: entity.nombre_producto,
      descripcion: entity.descripcion_producto,
      fechaPublicacion: entity.fecha_publicacion_producto,
      color: entity.color_producto,
      talla: entity.talla_producto,
      fotos: entity.fotos ?? [],
      estado: entity.estado_producto,
      tiendaId: entity.usuario_tienda,
    };
  }

  static ormToResponse(orm: ProductoOrmEntity): ProductoResponseDto {
    return {
      id: orm.id_producto,
      nombre: orm.nombre_producto,
      descripcion: orm.descripcion_producto,
      fechaPublicacion: orm.fecha_publicacion_producto,
      color: orm.color_producto,
      talla: orm.talla_producto ?? undefined,
      fotos: orm.Fotos?.map((foto) => foto.url_foto) ?? [],
      estado: orm.estado_producto,
      tiendaId: orm.usuario_tienda,
      tiendaNombre: orm.Tienda?.nombre_local,
    };
  }
}
