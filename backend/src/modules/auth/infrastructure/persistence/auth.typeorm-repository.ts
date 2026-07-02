import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthRepository } from '../../domain/interfaces/auth.repository.interface';
import { UsuarioOrmEntity } from '../../../usuarios/infrastructure/persistence/typeorm/usuario.orm-entity';
import { CompradorOrmEntity } from '../../../usuarios/infrastructure/persistence/typeorm/comprador.orm-entity';
import { VendedorOrmEntity } from '../../../usuarios/infrastructure/persistence/typeorm/vendedor.orm-entity';
import { TipoUsuario } from '../../application/dto/request/register.request.dto';

@Injectable()
export class AuthTypeOrmRepository implements IAuthRepository {
  constructor(
    @InjectRepository(UsuarioOrmEntity)
    private readonly repo: Repository<UsuarioOrmEntity>,
  ) {}

  async findByEmail(correo: string): Promise<UsuarioOrmEntity | null> {
    return this.repo.findOne({
      where: { correo_usuario: correo },
      relations: { Vendedor: true, Comprador: true },
    });
  }

  async findById(id: string): Promise<UsuarioOrmEntity | null> {
    return this.repo.findOne({
      where: { id_usuario: id },
      relations: { Vendedor: true, Comprador: true },
    });
  }

  async create(
    usuario: Partial<UsuarioOrmEntity>,
    tipoUsuario: TipoUsuario,
  ): Promise<UsuarioOrmEntity> {
    await this.repo.manager.transaction(async (manager) => {
      const nuevo = manager.create(UsuarioOrmEntity, usuario);
      await manager.save(nuevo);

      if (tipoUsuario === 'vendedor') {
        await manager.save(
          manager.create(VendedorOrmEntity, { id_vendedor: nuevo.id_usuario }),
        );
      } else {
        await manager.save(
          manager.create(CompradorOrmEntity, {
            id_comprador: nuevo.id_usuario,
          }),
        );
      }
    });

    const creado = await this.findById(usuario.id_usuario!);
    return creado!;
  }
}
