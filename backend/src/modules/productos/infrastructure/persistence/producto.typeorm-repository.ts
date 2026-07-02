import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductoRepository } from '../../domain/interfaces/producto.repository.interface';
import { ProductoOrmEntity } from './typeorm/producto.orm-entity';
import { FotoProductoOrmEntity } from './typeorm/foto-producto.orm-entity';

@Injectable()
export class ProductoTypeOrmRepository implements IProductoRepository {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly repo: Repository<ProductoOrmEntity>,
    @InjectRepository(FotoProductoOrmEntity)
    private readonly fotoRepo: Repository<FotoProductoOrmEntity>,
  ) {}

  async findAll(): Promise<ProductoOrmEntity[]> {
    return this.repo.find({ relations: { Tienda: true, Fotos: true } });
  }

  async findById(id: string): Promise<ProductoOrmEntity | null> {
    return this.repo.findOne({
      where: { id_producto: id },
      relations: { Tienda: true, Fotos: true },
    });
  }

  async findLastProducto(): Promise<ProductoOrmEntity | null> {
    const [producto] = await this.repo.find({
      order: { id_producto: 'DESC' },
      take: 1,
    });
    return producto ?? null;
  }

  async findByTienda(usuarioTienda: string): Promise<ProductoOrmEntity[]> {
    return this.repo.find({
      where: { usuario_tienda: usuarioTienda },
      relations: { Tienda: true, Fotos: true },
    });
  }

  async create(
    producto: Partial<ProductoOrmEntity>,
  ): Promise<ProductoOrmEntity> {
    const nuevo = this.repo.create(producto);
    return this.repo.save(nuevo);
  }

  async addFotos(
    idProducto: string,
    urls: string[],
  ): Promise<FotoProductoOrmEntity[]> {
    const fotos = urls.map((url) =>
      this.fotoRepo.create({
        id_producto: idProducto,
        url_foto: url,
      }),
    );
    return this.fotoRepo.save(fotos);
  }

  async update(
    id: string,
    producto: Partial<ProductoOrmEntity>,
  ): Promise<ProductoOrmEntity | null> {
    await this.repo.update(id, producto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
