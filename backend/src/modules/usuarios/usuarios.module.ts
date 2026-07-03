import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { ObtenerUsuariosUseCase } from './application/use-cases/obtener-usuarios.use-case';
import { IUsuarioRepository } from './domain/interfaces/usuario.repository.interface';
import { UsuarioTypeOrmRepository } from './infrastructure/persistence/usuario.typeorm-repository';
import { UsuarioOrmEntity } from './infrastructure/persistence/typeorm/usuario.orm-entity';
import { CompradorOrmEntity } from './infrastructure/persistence/typeorm/comprador.orm-entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioOrmEntity, CompradorOrmEntity]),
    StorageModule,
  ],
  controllers: [UsuariosController],
  providers: [
    ObtenerUsuariosUseCase,
    {
      provide: IUsuarioRepository,
      useClass: UsuarioTypeOrmRepository,
    },
  ],
})
export class UsuariosModule {}