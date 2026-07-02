import { Injectable, NotFoundException } from '@nestjs/common';
import { ITiendaRepository } from '../../domain/interfaces/tienda.repository.interface';
import { UpdateTiendaRequestDto } from '../dto/request/update-tienda.request.dto';
import { TiendaResponseDto } from '../dto/response/tienda.response.dto';
import { TiendaMapper } from '../mappers/tienda.mapper';
import {
  StorageService,
  UploadedStorageFile,
} from '../../../storage/storage.service';

@Injectable()
export class EditarTiendaUseCase {
  constructor(
    private readonly tiendaRepository: ITiendaRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(
    id: string,
    dto: UpdateTiendaRequestDto,
    logo?: UploadedStorageFile,
  ): Promise<TiendaResponseDto> {
    const existente = await this.tiendaRepository.findById(id);
    if (!existente) throw new NotFoundException('Tienda no encontrada');

    const actualizada = await this.tiendaRepository.update(id, {
      ...(dto.nombre_local && { nombre_local: dto.nombre_local }),
      ...(dto.descripcion_tienda && {
        descripcion_tienda: dto.descripcion_tienda,
      }),
      ...(dto.ubicacion_tienda !== undefined && {
        ubicacion_tienda: dto.ubicacion_tienda,
      }),
      ...(logo && {
        logo_local: await this.storageService.uploadFile(
          logo,
          `vendedores/${existente.id_vendedor}/tienda`,
        ),
      }),
    });

    if (!actualizada)
      throw new NotFoundException('Tienda no encontrada después de actualizar');
    return TiendaMapper.ormToResponse(actualizada);
  }
}
