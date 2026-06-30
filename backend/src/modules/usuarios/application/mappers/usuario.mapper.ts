import { UsuarioOrmEntity } from '../../infrastructure/persistence/typeorm/usuario.orm-entity';
import { UsuarioEntity } from '../../domain/entities/usuario.entity';
import { UsuarioResponseDto } from '../dto/response/usuario.response.dto';

export class UsuarioMapper {
  static ormToEntity(orm: UsuarioOrmEntity): UsuarioEntity {
    return {
      id_usuario: orm.id_usuario,
      nombres_usuario: orm.nombres_usuario,
      apellidos_usuario: orm.apellidos_usuario,
      correo_usuario: orm.correo_usuario,
      contrasena_usuario: orm.contrasena_usuario,
      ubicacion_usuario: orm.ubicacion_usuario,
    };
  }

  static ormToResponse(orm: UsuarioOrmEntity): UsuarioResponseDto {
    return {
      id: orm.id_usuario,
      nombres: orm.nombres_usuario,
      apellidos: orm.apellidos_usuario,
      correo: orm.correo_usuario,
      ubicacion: orm.ubicacion_usuario,
    };
  }
}
