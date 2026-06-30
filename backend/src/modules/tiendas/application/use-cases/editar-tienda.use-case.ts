import { Injectable, NotFoundException } from '@nestjs/common';
import { ITiendaRepository } from '../../domain/interfaces/tienda.repository.interface';
import { UpdateTiendaRequestDto } from '../dto/request/update-tienda.request.dto';
import { TiendaResponseDto } from '../dto/response/tienda.response.dto';
import { TiendaMapper } from '../mappers/tienda.mapper';

@Injectable()
export class EditarTiendaUseCase {
  constructor(private readonly tiendaRepository: ITiendaRepository) {}

  async execute(id: string, dto: UpdateTiendaRequestDto): Promise<TiendaResponseDto> {
    const existente = await this.tiendaRepository.findById(id);
    if (!existente) throw new NotFoundException('Tienda no encontrada');

    const actualizada = await this.tiendaRepository.update(id, {
      ...(dto.nombre_local && { nombre_local: dto.nombre_local }),
      ...(dto.descripcion_tienda && { descripcion_tienda: dto.descripcion_tienda }),
      ...(dto.ubicacion_tienda !== undefined && { ubicacion_tienda: dto.ubicacion_tienda }),
      ...(dto.ruc_local !== undefined && { ruc_local: dto.ruc_local }),
      ...(dto.logo_local && { logo_local: dto.logo_local }),
    });

    if (!actualizada) throw new NotFoundException('Tienda no encontrada después de actualizar');
    return TiendaMapper.ormToResponse(actualizada);
  }
}
