import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthRepository } from '../../domain/interfaces/auth.repository.interface';
import { UsuarioOrmEntity } from '../../../usuarios/infrastructure/persistence/typeorm/usuario.orm-entity';

@Injectable()
export class AuthTypeOrmRepository implements IAuthRepository {
  constructor(
    @InjectRepository(UsuarioOrmEntity)
    private readonly repo: Repository<UsuarioOrmEntity>,
  ) {}

  async findByEmail(correo: string): Promise<UsuarioOrmEntity | null> {
    return this.repo.findOne({ where: { correo_usuario: correo } });
  }

  async findById(id: string): Promise<UsuarioOrmEntity | null> {
    return this.repo.findOne({ where: { id_usuario: id } });
  }

  async create(usuario: Partial<UsuarioOrmEntity>): Promise<UsuarioOrmEntity> {
    const nuevo = this.repo.create(usuario);
    return this.repo.save(nuevo);
  }
}
