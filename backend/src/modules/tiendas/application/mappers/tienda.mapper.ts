import { TiendaOrmEntity } from '../../infrastructure/persistence/typeorm/tienda.orm-entity';
import { TiendaEntity } from '../../domain/entities/tienda.entity';
import { TiendaResponseDto } from '../dto/response/tienda.response.dto';

export class TiendaMapper {
  static ormToEntity(orm: TiendaOrmEntity): TiendaEntity {
    return {
      usuario_tienda: orm.usuario_tienda,
      nombre_local: orm.nombre_local,
      descripcion_tienda: orm.descripcion_tienda,
      fecha_creacion_tienda: orm.fecha_creacion_tienda,
      ubicacion_tienda: orm.ubicacion_tienda,
      logo_local: orm.logo_local ?? undefined,
      ruc_local: orm.ruc_local ?? undefined,
      id_vendedor: orm.id_vendedor,
    };
  }

  static ormToResponse(orm: TiendaOrmEntity): TiendaResponseDto {
    return {
      id: orm.usuario_tienda,
      nombre: orm.nombre_local,
      descripcion: orm.descripcion_tienda,
      fechaCreacion: orm.fecha_creacion_tienda,
      ubicacion: orm.ubicacion_tienda,
      logo: orm.logo_local ? Buffer.from(orm.logo_local).toString('base64') : undefined,
      ruc: orm.ruc_local ?? undefined,
      idVendedor: orm.id_vendedor,
      cantidadProductos: orm.Productos?.length,
    };
  }
}
