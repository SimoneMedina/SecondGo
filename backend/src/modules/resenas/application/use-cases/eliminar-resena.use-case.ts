import { Injectable, NotFoundException } from '@nestjs/common';
import { IResenaRepository } from '../../domain/interfaces/resena.repository.interface';

@Injectable()
export class EliminarResenaUseCase {
  constructor(private readonly resenaRepository: IResenaRepository) {}

  async execute(id: string): Promise<void> {
    const existente = await this.resenaRepository.findById(id);
    if (!existente) throw new NotFoundException('Reseña no encontrada');
    await this.resenaRepository.delete(id);
  }
}
