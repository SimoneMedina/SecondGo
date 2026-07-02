import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITiendaRepository } from '../../domain/interfaces/tienda.repository.interface';
import { CreateTiendaRequestDto } from '../dto/request/create-tienda.request.dto';
import { TiendaResponseDto } from '../dto/response/tienda.response.dto';
import { TiendaMapper } from '../mappers/tienda.mapper';
import { VendedorOrmEntity } from '../../../usuarios/infrastructure/persistence/typeorm/vendedor.orm-entity';
import {
  StorageService,
  UploadedStorageFile,
} from '../../../storage/storage.service';

@Injectable()
export class CrearTiendaUseCase {
  constructor(
    private readonly tiendaRepository: ITiendaRepository,
    @InjectRepository(VendedorOrmEntity)
    private readonly vendedorRepo: Repository<VendedorOrmEntity>,
    private readonly storageService: StorageService,
  ) {}

  async execute(
    dto: CreateTiendaRequestDto,
    idUsuario: string,
    logo?: UploadedStorageFile,
  ): Promise<TiendaResponseDto> {
    const existeTienda =
      await this.tiendaRepository.existsByVendedor(idUsuario);
    if (existeTienda) {
      throw new ConflictException('Ya tienes una tienda registrada');
    }

    let vendedor = await this.vendedorRepo.findOne({
      where: { id_vendedor: idUsuario },
    });
    if (!vendedor) {
      vendedor = this.vendedorRepo.create({ id_vendedor: idUsuario });
      await this.vendedorRepo.save(vendedor);
    }

    const logoUrl = logo
      ? await this.storageService.uploadFile(
          logo,
          `vendedores/${idUsuario}/tienda`,
        )
      : dto.logo_local;

    const orm = await this.tiendaRepository.create({
      usuario_tienda: idUsuario,
      nombre_local: dto.nombre_local,
      descripcion_tienda: dto.descripcion_tienda,
      ubicacion_tienda: Number(dto.ubicacion_tienda),
      ruc_local: dto.ruc_local,
      logo_local: logoUrl,
      fecha_creacion_tienda: new Date(),
      id_vendedor: idUsuario,
    });

    return TiendaMapper.ormToResponse(orm);
  }
}
