import { ProductoOrmEntity } from '../../infrastructure/persistence/typeorm/producto.orm-entity';
import { FotoProductoOrmEntity } from '../../infrastructure/persistence/typeorm/foto-producto.orm-entity';

export abstract class IProductoRepository {
  abstract findAll(): Promise<ProductoOrmEntity[]>;
  abstract findById(id: string): Promise<ProductoOrmEntity | null>;
  abstract findLastProducto(): Promise<ProductoOrmEntity | null>;
  abstract findByTienda(usuarioTienda: string): Promise<ProductoOrmEntity[]>;
  abstract create(
    producto: Partial<ProductoOrmEntity>,
  ): Promise<ProductoOrmEntity>;
  abstract update(
    id: string,
    producto: Partial<ProductoOrmEntity>,
  ): Promise<ProductoOrmEntity | null>;
  abstract addFotos(
    idProducto: string,
    urls: string[],
  ): Promise<FotoProductoOrmEntity[]>;
  abstract delete(id: string): Promise<void>;
}
