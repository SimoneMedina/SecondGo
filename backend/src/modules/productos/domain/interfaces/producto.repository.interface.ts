import { ProductoOrmEntity } from '../../infrastructure/persistence/typeorm/producto.orm-entity';

export abstract class IProductoRepository {
  abstract findAll(): Promise<ProductoOrmEntity[]>;
  abstract findById(id: string): Promise<ProductoOrmEntity | null>;
  abstract findLastProducto(): Promise<ProductoOrmEntity | null>;
  abstract findByTienda(usuarioTienda: string): Promise<ProductoOrmEntity[]>;
  abstract create(producto: Partial<ProductoOrmEntity>): Promise<ProductoOrmEntity>;
  abstract update(id: string, producto: Partial<ProductoOrmEntity>): Promise<ProductoOrmEntity | null>;
  abstract delete(id: string): Promise<void>;
}
