import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITiendaRepository } from '../../domain/interfaces/tienda.repository.interface';
import { ProductoOrmEntity } from '../../../productos/infrastructure/persistence/typeorm/producto.orm-entity';

@Injectable()
export class EliminarTiendaUseCase {
  constructor(
    private readonly tiendaRepository: ITiendaRepository,
    @InjectRepository(ProductoOrmEntity)
    private readonly productoRepo: Repository<ProductoOrmEntity>,
  ) {}

  async execute(id: string): Promise<void> {
    const existente = await this.tiendaRepository.findById(id);
    if (!existente) throw new NotFoundException('Tienda no encontrada');

    if (existente.Productos && existente.Productos.length > 0) {
      await this.productoRepo.delete({ usuario_tienda: id });
    }

    await this.tiendaRepository.delete(id);
  }
}
