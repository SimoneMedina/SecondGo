import { Injectable, NotFoundException } from '@nestjs/common';
import { IProductoRepository } from '../../domain/interfaces/producto.repository.interface';
import { UpdateProductoRequestDto } from '../dto/request/update-producto.request.dto';
import { ProductoResponseDto } from '../dto/response/producto.response.dto';
import { ProductoMapper } from '../mappers/producto.mapper';
import {
  StorageService,
  UploadedStorageFile,
} from '../../../storage/storage.service';

@Injectable()
export class EditarProductoUseCase {
  constructor(
    private readonly productoRepository: IProductoRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(
    id: string,
    dto: UpdateProductoRequestDto,
    fotos: UploadedStorageFile[] = [],
  ): Promise<ProductoResponseDto> {
    const existente = await this.productoRepository.findById(id);
    if (!existente) throw new NotFoundException('Producto no encontrado');

    const actualizado = await this.productoRepository.update(id, {
      ...(dto.nombre_producto && { nombre_producto: dto.nombre_producto }),
      ...(dto.descripcion_producto && {
        descripcion_producto: dto.descripcion_producto,
      }),
      ...(dto.color_producto && { color_producto: dto.color_producto }),
      ...(dto.talla_producto !== undefined && {
        talla_producto: dto.talla_producto,
      }),
      ...(dto.estado_producto && { estado_producto: dto.estado_producto }),
    });

    if (!actualizado)
      throw new NotFoundException(
        'Producto no encontrado después de actualizar',
      );
    if (fotos.length > 0) {
      const folder = `vendedores/${existente.usuario_tienda}/productos/${id}`;
      const urls = await Promise.all(
        fotos.map((foto) => this.storageService.uploadFile(foto, folder)),
      );
      await this.productoRepository.addFotos(id, urls);
    }

    const producto = await this.productoRepository.findById(id);
    return ProductoMapper.ormToResponse(producto ?? actualizado);
  }
}
