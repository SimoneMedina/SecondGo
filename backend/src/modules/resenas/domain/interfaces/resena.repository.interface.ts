import { ResenaOrmEntity } from '../../infrastructure/persistence/typeorm/resena.orm-entity';

export abstract class IResenaRepository {
  abstract findAll(): Promise<ResenaOrmEntity[]>;
  abstract findById(id: string): Promise<ResenaOrmEntity | null>;
  abstract findByTienda(usuarioTienda: string): Promise<ResenaOrmEntity[]>;
  abstract create(resena: Partial<ResenaOrmEntity>): Promise<ResenaOrmEntity>;
  abstract delete(id: string): Promise<void>;
}
