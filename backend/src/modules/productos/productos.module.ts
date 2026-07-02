import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { CrearProductoUseCase } from './application/use-cases/crear-producto.use-case';
import { ObtenerProductosUseCase } from './application/use-cases/obtener-productos.use-case';
import { EditarProductoUseCase } from './application/use-cases/editar-producto.use-case';
import { EliminarProductoUseCase } from './application/use-cases/eliminar-producto.use-case';
import { IProductoRepository } from './domain/interfaces/producto.repository.interface';
import { ProductoTypeOrmRepository } from './infrastructure/persistence/producto.typeorm-repository';
import { ProductoOrmEntity } from './infrastructure/persistence/typeorm/producto.orm-entity';
import { FotoProductoOrmEntity } from './infrastructure/persistence/typeorm/foto-producto.orm-entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoOrmEntity, FotoProductoOrmEntity]),
    StorageModule,
  ],
  controllers: [ProductosController],
  providers: [
    CrearProductoUseCase,
    ObtenerProductosUseCase,
    EditarProductoUseCase,
    EliminarProductoUseCase,
    {
      provide: IProductoRepository,
      useClass: ProductoTypeOrmRepository,
    },
  ],
})
export class ProductosModule {}
