import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductoRepository } from '../../domain/interfaces/producto.repository.interface';
import { ProductoOrmEntity } from './typeorm/producto.orm-entity';

@Injectable()
export class ProductoTypeOrmRepository implements IProductoRepository {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly repo: Repository<ProductoOrmEntity>,
  ) {}

  async findAll(): Promise<ProductoOrmEntity[]> {
    return this.repo.find({ relations: { Tienda: true } });
  }

  async findById(id: string): Promise<ProductoOrmEntity | null> {
    return this.repo.findOne({ where: { id_producto: id }, relations: { Tienda: true } });
  }

  async findLastProducto(): Promise<ProductoOrmEntity | null> {
    return this.repo.findOne({
      order: { id_producto: 'DESC' },
    });
  }

  async findByTienda(usuarioTienda: string): Promise<ProductoOrmEntity[]> {
    return this.repo.find({
      where: { usuario_tienda: usuarioTienda },
      relations: { Tienda: true },
    });
  }

  async create(producto: Partial<ProductoOrmEntity>): Promise<ProductoOrmEntity> {
    const nuevo = this.repo.create(producto);
    return this.repo.save(nuevo);
  }

  async update(id: string, producto: Partial<ProductoOrmEntity>): Promise<ProductoOrmEntity | null> {
    await this.repo.update(id, producto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
