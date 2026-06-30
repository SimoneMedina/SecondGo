import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendasController } from './tiendas.controller';
import { CrearTiendaUseCase } from './application/use-cases/crear-tienda.use-case';
import { ObtenerTiendasUseCase } from './application/use-cases/obtener-tiendas.use-case';
import { EditarTiendaUseCase } from './application/use-cases/editar-tienda.use-case';
import { EliminarTiendaUseCase } from './application/use-cases/eliminar-tienda.use-case';
import { ITiendaRepository } from './domain/interfaces/tienda.repository.interface';
import { TiendaTypeOrmRepository } from './infrastructure/persistence/tienda.typeorm-repository';
import { TiendaOrmEntity } from './infrastructure/persistence/typeorm/tienda.orm-entity';
import { VendedorOrmEntity } from '../usuarios/infrastructure/persistence/typeorm/vendedor.orm-entity';
import { ProductoOrmEntity } from '../productos/infrastructure/persistence/typeorm/producto.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaOrmEntity, VendedorOrmEntity, ProductoOrmEntity])],
  controllers: [TiendasController],
  providers: [
    CrearTiendaUseCase,
    ObtenerTiendasUseCase,
    EditarTiendaUseCase,
    EliminarTiendaUseCase,
    {
      provide: ITiendaRepository,
      useClass: TiendaTypeOrmRepository,
    },
  ],
})
export class TiendasModule {}
