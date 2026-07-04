import { Injectable, NotFoundException } from '@nestjs/common';
import { IProductoRepository } from '../../domain/interfaces/producto.repository.interface';
import { ProductoResponseDto } from '../dto/response/producto.response.dto';
import { ProductoListResponseDto } from '../dto/response/producto-list.response.dto';
import { ProductoMapper } from '../mappers/producto.mapper';

@Injectable()
export class ObtenerProductosUseCase {
  constructor(private readonly productoRepository: IProductoRepository) {}

  async executeAll(): Promise<ProductoListResponseDto> {
    const orms = await this.productoRepository.findAll();
    const productos = orms.map(ProductoMapper.ormToResponse);

    return {
      productos,
      total: productos.length,
    };
  }

  async executeById(id: string): Promise<ProductoResponseDto> {
    const orm = await this.productoRepository.findById(id);

    if (!orm) {
      throw new NotFoundException('Producto no encontrado');
    }

    return ProductoMapper.ormToResponse(orm);
  }

  async executeByTienda(usuarioTienda: string): Promise<ProductoListResponseDto> {
    const orms = await this.productoRepository.findByTienda(usuarioTienda);
    const productos = orms.map(ProductoMapper.ormToResponse);

    return {
      productos,
      total: productos.length,
    };
  }
}