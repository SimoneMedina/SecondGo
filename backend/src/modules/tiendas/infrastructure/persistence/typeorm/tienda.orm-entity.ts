import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { VendedorOrmEntity } from '../../../../usuarios/infrastructure/persistence/typeorm/vendedor.orm-entity';
import { ProductoOrmEntity } from '../../../../productos/infrastructure/persistence/typeorm/producto.orm-entity';

@Entity('Empresas')
export class TiendaOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  usuario_tienda: string;

  @Column({ type: 'varchar', length: 50 })
  nombre_local: string;

  @Column({ type: 'varchar', length: 250 })
  descripcion_tienda: string;

  @Column({ type: 'timestamp' })
  fecha_creacion_tienda: Date;

  @Column({ type: 'varchar', length: 250, nullable: true })
  ubicacion_tienda: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_local: string | null;

  @Column({ type: 'varchar', length: 36 })
  id_vendedor: string;

  @OneToOne(() => VendedorOrmEntity, (v) => v.Tienda)
  @JoinColumn({ name: 'id_vendedor' })
  Vendedor: VendedorOrmEntity;

  @OneToMany(() => ProductoOrmEntity, (p) => p.Tienda)
  Productos: ProductoOrmEntity[];
}
