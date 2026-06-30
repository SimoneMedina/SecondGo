import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResenaRepository } from '../../domain/interfaces/resena.repository.interface';
import { ResenaOrmEntity } from './typeorm/resena.orm-entity';

@Injectable()
export class ResenaTypeOrmRepository implements IResenaRepository {
  constructor(
    @InjectRepository(ResenaOrmEntity)
    private readonly repo: Repository<ResenaOrmEntity>,
  ) {}

  async findAll(): Promise<ResenaOrmEntity[]> {
    return this.repo.find({ relations: { Comprador: { Usuario: true }, Empresa: true } });
  }

  async findById(id: string): Promise<ResenaOrmEntity | null> {
    return this.repo.findOne({ where: { id_reseña: id } });
  }

  async findByTienda(usuarioTienda: string): Promise<ResenaOrmEntity[]> {
    return this.repo.find({
      where: { usuario_tienda: usuarioTienda },
      relations: { Comprador: { Usuario: true } },
    });
  }

  async create(resena: Partial<ResenaOrmEntity>): Promise<ResenaOrmEntity> {
    const nueva = this.repo.create(resena);
    return this.repo.save(nueva);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
