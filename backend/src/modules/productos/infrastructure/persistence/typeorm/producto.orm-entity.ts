import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TiendaOrmEntity } from '../../../../tiendas/infrastructure/persistence/typeorm/tienda.orm-entity';
import { FotoProductoOrmEntity } from './foto-producto.orm-entity';

@Entity('Productos')
export class ProductoOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 25 })
  id_producto: string;

  @Column({ type: 'varchar', length: 50 })
  nombre_producto: string;

  @Column({ type: 'varchar', length: 250 })
  descripcion_producto: string;

  @Column({ type: 'timestamp' })
  fecha_publicacion_producto: Date;

  @Column({ type: 'varchar', length: 15 })
  color_producto: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  talla_producto: string | null;

  @Column({ type: 'varchar', length: 15 })
  estado_producto: string;

  @Column({ type: 'varchar', length: 50 })
  usuario_tienda: string;

  @ManyToOne(() => TiendaOrmEntity, (t) => t.Productos)
  @JoinColumn({ name: 'usuario_tienda' })
  Tienda: TiendaOrmEntity;

  @OneToMany(() => FotoProductoOrmEntity, (f) => f.Producto, { cascade: true })
  Fotos: FotoProductoOrmEntity[];
}
