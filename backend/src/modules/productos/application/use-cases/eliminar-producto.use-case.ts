import { Injectable, NotFoundException } from '@nestjs/common';
import { IProductoRepository } from '../../domain/interfaces/producto.repository.interface';

@Injectable()
export class EliminarProductoUseCase {
  constructor(private readonly productoRepository: IProductoRepository) {}

  async execute(id: string): Promise<void> {
    const existente = await this.productoRepository.findById(id);
    if (!existente) throw new NotFoundException('Producto no encontrado');
    await this.productoRepository.delete(id);
  }
}
