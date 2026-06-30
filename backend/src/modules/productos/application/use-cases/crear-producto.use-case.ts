import { Injectable } from '@nestjs/common';
import { IProductoRepository } from '../../domain/interfaces/producto.repository.interface';
import { CreateProductoRequestDto } from '../dto/request/create-producto.request.dto';
import { ProductoResponseDto } from '../dto/response/producto.response.dto';
import { ProductoMapper } from '../mappers/producto.mapper';

@Injectable()
export class CrearProductoUseCase {
  constructor(private readonly productoRepository: IProductoRepository) {}

  async execute(dto: CreateProductoRequestDto, usuarioTienda: string): Promise<ProductoResponseDto> {
    const ultimoProducto = await this.productoRepository.findLastProducto();
    let siguienteNumero = 1;
    if (ultimoProducto && ultimoProducto.id_producto.startsWith('PROD')) {
      const ultimoNumero = parseInt(ultimoProducto.id_producto.substring(4), 10);
      if (!isNaN(ultimoNumero)) {
        siguienteNumero = ultimoNumero + 1;
      }
    }

    const orm = await this.productoRepository.create({
      id_producto: `PROD${String(siguienteNumero).padStart(3, '0')}`,
      nombre_producto: dto.nombre_producto,
      descripcion_producto: dto.descripcion_producto,
      color_producto: dto.color_producto,
      talla_producto: dto.talla_producto,
      dimensiones_producto: dto.dimensiones_producto,
      estado_producto: dto.estado_producto,
      foto_producto: dto.foto_producto,
      fecha_publicacion_producto: new Date(),
      usuario_tienda: usuarioTienda,
    });

    return ProductoMapper.ormToResponse(orm);
  }
}
