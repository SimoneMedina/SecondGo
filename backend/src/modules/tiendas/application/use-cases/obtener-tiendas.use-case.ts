import { Injectable, NotFoundException } from '@nestjs/common';
import { ITiendaRepository } from '../../domain/interfaces/tienda.repository.interface';
import { TiendaResponseDto } from '../dto/response/tienda.response.dto';
import { TiendaMapper } from '../mappers/tienda.mapper';

@Injectable()
export class ObtenerTiendasUseCase {
  constructor(private readonly tiendaRepository: ITiendaRepository) {}

  async executeAll(): Promise<TiendaResponseDto[]> {
    const orms = await this.tiendaRepository.findAll();
    return orms.map(TiendaMapper.ormToResponse);
  }

  async executeById(id: string): Promise<TiendaResponseDto> {
    const orm = await this.tiendaRepository.findById(id);
    if (!orm) throw new NotFoundException('Tienda no encontrada');
    return TiendaMapper.ormToResponse(orm);
  }

  async executeByVendedor(idVendedor: string): Promise<TiendaResponseDto> {
    const orm = await this.tiendaRepository.findByVendedor(idVendedor);
    if (!orm) throw new NotFoundException('Tienda no encontrada para este vendedor');
    return TiendaMapper.ormToResponse(orm);
  }
}