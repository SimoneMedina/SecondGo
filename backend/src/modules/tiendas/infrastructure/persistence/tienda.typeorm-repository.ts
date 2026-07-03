import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITiendaRepository } from '../../domain/interfaces/tienda.repository.interface';
import { TiendaOrmEntity } from './typeorm/tienda.orm-entity';

@Injectable()
export class TiendaTypeOrmRepository implements ITiendaRepository {
  constructor(
    @InjectRepository(TiendaOrmEntity)
    private readonly repo: Repository<TiendaOrmEntity>,
  ) {}

  async findAll(): Promise<TiendaOrmEntity[]> {
    return this.repo.find({
      relations: { Productos: true },
      order: { nombre_local: 'ASC' },
    });
  }

  async findById(id: string): Promise<TiendaOrmEntity | null> {
    return this.repo.findOne({
      where: { usuario_tienda: id },
      relations: { Productos: true },
    });
  }

  async findByVendedor(idVendedor: string): Promise<TiendaOrmEntity | null> {
    return this.repo.findOne({
      where: { id_vendedor: idVendedor },
      relations: { Productos: true },
    });
  }

  async existsByVendedor(idVendedor: string): Promise<boolean> {
    const count = await this.repo.count({ where: { id_vendedor: idVendedor } });
    return count > 0;
  }

  async create(tienda: Partial<TiendaOrmEntity>): Promise<TiendaOrmEntity> {
    const nueva = this.repo.create(tienda);
    return this.repo.save(nueva);
  }

  async update(id: string, tienda: Partial<TiendaOrmEntity>): Promise<TiendaOrmEntity | null> {
    await this.repo.update(id, tienda);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
