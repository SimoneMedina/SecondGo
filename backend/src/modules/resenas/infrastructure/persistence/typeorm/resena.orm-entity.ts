import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CompradorOrmEntity } from '../../../../usuarios/infrastructure/persistence/typeorm/comprador.orm-entity';
import { TiendaOrmEntity } from '../../../../tiendas/infrastructure/persistence/typeorm/tienda.orm-entity';

@Entity('Reseñas')
export class ResenaOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 18 })
  id_reseña: string;

  @Column({ type: 'varchar', length: 15 })
  calificacion_reseña: string;

  @Column({ type: 'float' })
  valor_reseña: number;

  @Column({ type: 'varchar', length: 250 })
  descripcion_reseña: string;

  @Column({ type: 'varchar', length: 36 })
  id_comprador: string;

  @ManyToOne(() => CompradorOrmEntity)
  @JoinColumn({ name: 'id_comprador' })
  Comprador: CompradorOrmEntity;

  @Column({ type: 'varchar', length: 50 })
  usuario_tienda: string;

  @ManyToOne(() => TiendaOrmEntity)
  @JoinColumn({ name: 'usuario_tienda' })
  Empresa: TiendaOrmEntity;
}
