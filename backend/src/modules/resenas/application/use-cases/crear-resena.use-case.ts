import { Injectable, ConflictException } from '@nestjs/common';
import { IResenaRepository } from '../../domain/interfaces/resena.repository.interface';
import { CreateResenaRequestDto } from '../dto/request/create-resena.request.dto';
import { ResenaResponseDto } from '../dto/response/resena.response.dto';
import { ResenaMapper } from '../mappers/resena.mapper';

@Injectable()
export class CrearResenaUseCase {
  constructor(private readonly resenaRepository: IResenaRepository) {}

  async execute(dto: CreateResenaRequestDto, idComprador: string): Promise<ResenaResponseDto> {
    const existente = await this.resenaRepository.findById(dto.id_reseña);
    if (existente) {
      throw new ConflictException('El ID de reseña ya existe');
    }

    const orm = await this.resenaRepository.create({
      id_reseña: dto.id_reseña,
      calificacion_reseña: dto.calificacion_reseña,
      valor_reseña: dto.valor_reseña,
      descripcion_reseña: dto.descripcion_reseña,
      id_comprador: idComprador,
      usuario_tienda: dto.usuario_tienda,
    });

    return ResenaMapper.ormToResponse(orm);
  }
}
