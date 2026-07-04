import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenasController } from './resenas.controller';
import { CrearResenaUseCase } from './application/use-cases/crear-resena.use-case';
import { ObtenerResenasUseCase } from './application/use-cases/obtener-resenas.use-case';
import { EliminarResenaUseCase } from './application/use-cases/eliminar-resena.use-case';
import { IResenaRepository } from './domain/interfaces/resena.repository.interface';
import { ResenaTypeOrmRepository } from './infrastructure/persistence/resena.typeorm-repository';
import { ResenaOrmEntity } from './infrastructure/persistence/typeorm/resena.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResenaOrmEntity])],
  controllers: [ResenasController],
  providers: [
    CrearResenaUseCase,
    ObtenerResenasUseCase,
    EliminarResenaUseCase,
    {
      provide: IResenaRepository,
      useClass: ResenaTypeOrmRepository,
    },
  ],
  exports: [ObtenerResenasUseCase],
})
export class ResenasModule {}