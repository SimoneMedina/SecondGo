import { Injectable } from '@nestjs/common';
import { ObtenerTiendasUseCase } from './obtener-tiendas.use-case';
import { ObtenerResenasUseCase } from '../../../resenas/application/use-cases/obtener-resenas.use-case';
import { ProductoMapper } from '../../../productos/application/mappers/producto.mapper';
import { TiendaDetalleResponseDto } from '../dto/response/tienda-detalle.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoOrmEntity } from '../../../productos/infrastructure/persistence/typeorm/producto.orm-entity';
import { Repository } from 'typeorm';

@Injectable()
export class ObtenerDetalleTiendaUseCase {
  constructor(
    private readonly obtenerTiendasUseCase: ObtenerTiendasUseCase,
    private readonly obtenerResenasUseCase: ObtenerResenasUseCase,

    @InjectRepository(ProductoOrmEntity)
    private readonly productoRepo: Repository<ProductoOrmEntity>,
  ) {}

  async execute(id: string): Promise<TiendaDetalleResponseDto> {
    const tienda = await this.obtenerTiendasUseCase.executeById(id);

    const productosOrm = await this.productoRepo.find({
      where: { usuario_tienda: id },
      relations: { Fotos: true },
    });

    const productos = productosOrm.map(ProductoMapper.ormToResponse);

    const resenasRaw = await this.obtenerResenasUseCase.executeByTienda(id);

    const resenas = resenasRaw.map((r: any) => ({
      id: r.id || r.id_resena,
      calificacion: Number(r.calificacion || r.puntuacion || r.valoracion || 0),
      comentario: r.comentario || r.descripcion || r.texto_resena || '',
      compradorNombre:
        r.compradorNombre || r.usuarioComprador || r.comprador || 'Comprador',
    }));

    const promedioResenas =
      resenas.length > 0
        ? resenas.reduce((total, r) => total + r.calificacion, 0) /
          resenas.length
        : 0;

    return {
      tienda,
      productos,
      resenas,
      promedioResenas,
    };
  }
}