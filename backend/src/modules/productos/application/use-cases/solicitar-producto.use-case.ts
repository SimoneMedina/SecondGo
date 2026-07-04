import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoOrmEntity } from '../../infrastructure/persistence/typeorm/producto.orm-entity';
import { Repository } from 'typeorm';
import { ProductoMapper } from '../mappers/producto.mapper';
import { ProductoResponseDto } from '../dto/response/producto.response.dto';

@Injectable()
export class SolicitarProductoUseCase {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly productoRepo: Repository<ProductoOrmEntity>,
  ) {}

  async execute(
    idProducto: string,
    idComprador: string,
    rol?: string,
  ): Promise<ProductoResponseDto> {
    if (rol !== 'comprador') {
      throw new ForbiddenException('Solo los compradores pueden solicitar prendas');
    }

    const producto = await this.productoRepo.findOne({
      where: { id_producto: idProducto },
      relations: {
        Fotos: true,
        Tienda: true,
      },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (producto.estado_producto.toLowerCase() === 'solicitado') {
      throw new BadRequestException('Esta prenda ya fue solicitada');
    }

    producto.estado_producto = 'Pendiente';
    producto.id_comprador_solicitante = idComprador;

    const actualizado = await this.productoRepo.save(producto);

    return ProductoMapper.ormToResponse(actualizado);
  }
}