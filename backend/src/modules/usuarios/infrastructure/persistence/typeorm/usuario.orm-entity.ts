import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { VendedorOrmEntity } from './vendedor.orm-entity';
import { CompradorOrmEntity } from './comprador.orm-entity';

@Entity('Usuarios')
export class UsuarioOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_usuario: string;

  @Column({ type: 'varchar', length: 50 })
  nombres_usuario: string;

  @Column({ type: 'varchar', length: 51 })
  apellidos_usuario: string;

  @Column({ type: 'varchar', length: 50 })
  correo_usuario: string;

  @Column({ type: 'varchar', length: 100 })
  contrasena_usuario: string;

  @Column({ type: 'int', nullable: true })
  ubicacion_usuario: number | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  foto_usuario: string | null;

  @OneToOne(() => VendedorOrmEntity, (v) => v.Usuario)
  Vendedor?: VendedorOrmEntity;

  @OneToOne(() => CompradorOrmEntity, (c) => c.Usuario)
  Comprador?: CompradorOrmEntity;
}
