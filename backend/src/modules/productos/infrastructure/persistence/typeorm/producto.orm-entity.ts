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
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_producto: string;

  @Column({ type: 'varchar', length: 100 })
  nombre_producto: string;

  @Column({ type: 'varchar', length: 250 })
  descripcion_producto: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_publicacion_producto: Date | null;

  @Column({ type: 'varchar', length: 50 })
  color_producto: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  hex_color: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  grupo_color: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo_prenda: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estilo_producto: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  talla_producto: string | null;

  @Column({ type: 'varchar', length: 30 })
  estado_producto: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  id_comprador_solicitante: string | null;

  @Column({ type: 'varchar', length: 50 })
  usuario_tienda: string;

  @ManyToOne(() => TiendaOrmEntity, (t) => t.Productos)
  @JoinColumn({ name: 'usuario_tienda' })
  Tienda: TiendaOrmEntity;

  @OneToMany(() => FotoProductoOrmEntity, (f) => f.Producto)
  Fotos: FotoProductoOrmEntity[];
}