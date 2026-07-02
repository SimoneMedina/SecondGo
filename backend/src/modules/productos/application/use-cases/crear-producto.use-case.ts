import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductoRepository } from '../../domain/interfaces/producto.repository.interface';
import { CreateProductoRequestDto } from '../dto/request/create-producto.request.dto';
import { ProductoResponseDto } from '../dto/response/producto.response.dto';
import { ProductoMapper } from '../mappers/producto.mapper';
import {
  StorageService,
  UploadedStorageFile,
} from '../../../storage/storage.service';
import { TiendaOrmEntity } from '../../../tiendas/infrastructure/persistence/typeorm/tienda.orm-entity';

@Injectable()
export class CrearProductoUseCase {
  constructor(
    private readonly productoRepository: IProductoRepository,
    private readonly storageService: StorageService,
    @InjectRepository(TiendaOrmEntity)
    private readonly tiendaRepo: Repository<TiendaOrmEntity>,
  ) {}

  async execute(
    dto: CreateProductoRequestDto,
    usuarioTienda: string,
    fotos: UploadedStorageFile[] = [],
  ): Promise<ProductoResponseDto> {
    const tienda = await this.tiendaRepo.findOne({
      where: { usuario_tienda: usuarioTienda },
    });
    if (!tienda) {
      throw new BadRequestException('Debes crear tu tienda antes de publicar productos');
    }

    const ultimoProducto = await this.productoRepository.findLastProducto();
    let siguienteNumero = 1;
    if (ultimoProducto && ultimoProducto.id_producto.startsWith('PROD')) {
      const ultimoNumero = parseInt(
        ultimoProducto.id_producto.substring(4),
        10,
      );
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
      estado_producto: dto.estado_producto,
      fecha_publicacion_producto: new Date(),
      usuario_tienda: usuarioTienda,
    });

    if (fotos.length > 0) {
      const folder = `vendedores/${usuarioTienda}/productos/${orm.id_producto}`;
      const urls = await Promise.all(
        fotos.map((foto) => this.storageService.uploadFile(foto, folder)),
      );
      await this.productoRepository.addFotos(orm.id_producto, urls);
    }

    const producto = await this.productoRepository.findById(orm.id_producto);
    return ProductoMapper.ormToResponse(producto ?? orm);
  }
}
