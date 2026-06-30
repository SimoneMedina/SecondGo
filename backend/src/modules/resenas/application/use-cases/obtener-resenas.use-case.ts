import { Injectable, NotFoundException } from '@nestjs/common';
import { IResenaRepository } from '../../domain/interfaces/resena.repository.interface';
import { ResenaResponseDto } from '../dto/response/resena.response.dto';
import { ResenaMapper } from '../mappers/resena.mapper';

@Injectable()
export class ObtenerResenasUseCase {
  constructor(private readonly resenaRepository: IResenaRepository) {}

  async executeAll(): Promise<ResenaResponseDto[]> {
    const orms = await this.resenaRepository.findAll();
    return orms.map(ResenaMapper.ormToResponse);
  }

  async executeByTienda(usuarioTienda: string): Promise<ResenaResponseDto[]> {
    const orms = await this.resenaRepository.findByTienda(usuarioTienda);
    return orms.map(ResenaMapper.ormToResponse);
  }
}
