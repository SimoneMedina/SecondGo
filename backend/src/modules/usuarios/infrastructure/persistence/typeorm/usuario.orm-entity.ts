import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { VendedorOrmEntity } from './vendedor.orm-entity';
import { CompradorOrmEntity } from './comprador.orm-entity';

@Entity('Usuarios')
export class UsuarioOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 25 })
  id_usuario: string;

  @Column({ type: 'varchar', length: 50 })
  nombres_usuario: string;

  @Column({ type: 'varchar', length: 51 })
  apellidos_usuario: string;

  @Column({ type: 'varchar', length: 50 })
  correo_usuario: string;

  @Column({ type: 'varchar', length: 100 })
  contrasena_usuario: string;

  @Column({ type: 'float' })
  ubicacion_usuario: number;

  @OneToOne(() => VendedorOrmEntity, (v) => v.Usuario)
  Vendedor?: VendedorOrmEntity;

  @OneToOne(() => CompradorOrmEntity, (c) => c.Usuario)
  Comprador?: CompradorOrmEntity;
}
