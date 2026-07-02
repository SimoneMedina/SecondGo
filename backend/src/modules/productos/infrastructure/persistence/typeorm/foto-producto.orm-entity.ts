import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductoOrmEntity } from './producto.orm-entity';

@Entity('FotosProductos')
export class FotoProductoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id_foto: string;

  @Column({ type: 'varchar', length: 500 })
  url_foto: string;

  @Column({ type: 'varchar', length: 25 })
  id_producto: string;

  @ManyToOne(() => ProductoOrmEntity, (p) => p.Fotos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_producto' })
  Producto: ProductoOrmEntity;
}
