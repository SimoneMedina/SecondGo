import { ResenaOrmEntity } from '../../infrastructure/persistence/typeorm/resena.orm-entity';
import { ResenaEntity } from '../../domain/entities/resena.entity';
import { ResenaResponseDto } from '../dto/response/resena.response.dto';

export class ResenaMapper {
  static ormToEntity(orm: ResenaOrmEntity): ResenaEntity {
    return {
      id_reseña: orm.id_reseña,
      calificacion_reseña: orm.calificacion_reseña,
      valor_reseña: orm.valor_reseña,
      descripcion_reseña: orm.descripcion_reseña,
      id_comprador: orm.id_comprador,
      usuario_tienda: orm.usuario_tienda,
    };
  }

  static ormToResponse(orm: ResenaOrmEntity): ResenaResponseDto {
    return {
      id: orm.id_reseña,
      calificacion: orm.calificacion_reseña,
      valor: orm.valor_reseña,
      descripcion: orm.descripcion_reseña,
      compradorId: orm.id_comprador,
      compradorNombre: orm.Comprador?.Usuario?.nombres_usuario
        ? `${orm.Comprador.Usuario.nombres_usuario} ${orm.Comprador.Usuario.apellidos_usuario}`
        : undefined,
      tiendaId: orm.usuario_tienda,
    };
  }
}
