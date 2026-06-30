import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUsuarioRepository } from '../../domain/interfaces/usuario.repository.interface';
import { UsuarioOrmEntity } from './typeorm/usuario.orm-entity';
import { CompradorOrmEntity } from './typeorm/comprador.orm-entity';

@Injectable()
export class UsuarioTypeOrmRepository implements IUsuarioRepository {
  constructor(
    @InjectRepository(UsuarioOrmEntity)
    private readonly repo: Repository<UsuarioOrmEntity>,
    @InjectRepository(CompradorOrmEntity)
    private readonly compradorRepo: Repository<CompradorOrmEntity>,
  ) {}

  async findAll(): Promise<UsuarioOrmEntity[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<UsuarioOrmEntity | null> {
    return this.repo.findOne({ where: { id_usuario: id } });
  }

  async findCompradoresWithUsuarios(): Promise<any[]> {
    return this.compradorRepo.find({ relations: { Usuario: true } });
  }
}
