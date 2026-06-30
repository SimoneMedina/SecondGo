import { TiendaOrmEntity } from '../../infrastructure/persistence/typeorm/tienda.orm-entity';

export abstract class ITiendaRepository {
  abstract findAll(): Promise<TiendaOrmEntity[]>;
  abstract findById(id: string): Promise<TiendaOrmEntity | null>;
  abstract findByVendedor(idVendedor: string): Promise<TiendaOrmEntity | null>;
  abstract existsByVendedor(idVendedor: string): Promise<boolean>;
  abstract create(tienda: Partial<TiendaOrmEntity>): Promise<TiendaOrmEntity>;
  abstract update(id: string, tienda: Partial<TiendaOrmEntity>): Promise<TiendaOrmEntity | null>;
  abstract delete(id: string): Promise<void>;
}
