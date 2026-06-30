import { UsuarioOrmEntity } from '../../../usuarios/infrastructure/persistence/typeorm/usuario.orm-entity';

export abstract class IAuthRepository {
  abstract findByEmail(correo: string): Promise<UsuarioOrmEntity | null>;
  abstract findById(id: string): Promise<UsuarioOrmEntity | null>;
  abstract create(usuario: Partial<UsuarioOrmEntity>): Promise<UsuarioOrmEntity>;
}
