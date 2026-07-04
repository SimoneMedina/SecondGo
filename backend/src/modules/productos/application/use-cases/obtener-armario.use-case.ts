import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoOrmEntity } from '../../infrastructure/persistence/typeorm/producto.orm-entity';
import { ProductoMapper } from '../mappers/producto.mapper';
import { ProductoListResponseDto } from '../dto/response/producto-list.response.dto';

@Injectable()
export class ObtenerArmarioUseCase {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly productoRepository: Repository<ProductoOrmEntity>,
  ) {}

  async execute(idComprador: string): Promise<ProductoListResponseDto> {
    const productosOrm = await this.productoRepository.find({
      where: {
        id_comprador_solicitante: idComprador,
      },
      relations: {
        Fotos: true,
        Tienda: true,
      },
      order: {
        fecha_publicacion_producto: 'DESC',
      },
    });

    const productos = productosOrm.map((p) => ProductoMapper.ormToResponse(p));

    return {
      productos,
      total: productos.length,
    };
  }
}