import { UsuarioOrmEntity } from '../../../usuarios/infrastructure/persistence/typeorm/usuario.orm-entity';
import { UbicacionOrmEntity } from '../../../ubicaciones/infrastructure/persistence/typeorm/ubicacion.orm-entity';
import { TipoUsuario } from '../../application/dto/request/register.request.dto';

export abstract class IAuthRepository {
  abstract findByEmail(correo: string): Promise<UsuarioOrmEntity | null>;

  abstract findById(id: string): Promise<UsuarioOrmEntity | null>;

  abstract create(
    usuario: Partial<UsuarioOrmEntity>,
    tipoUsuario: TipoUsuario,
  ): Promise<UsuarioOrmEntity>;

  abstract createUbicacion(
    latitud: number,
    longitud: number,
    direccion?: string,
  ): Promise<UbicacionOrmEntity>;
}