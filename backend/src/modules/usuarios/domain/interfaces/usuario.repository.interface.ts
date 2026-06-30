import { UsuarioOrmEntity } from '../../infrastructure/persistence/typeorm/usuario.orm-entity';

export abstract class IUsuarioRepository {
  abstract findAll(): Promise<UsuarioOrmEntity[]>;
  abstract findById(id: string): Promise<UsuarioOrmEntity | null>;
  abstract findCompradoresWithUsuarios(): Promise<any[]>;
}
