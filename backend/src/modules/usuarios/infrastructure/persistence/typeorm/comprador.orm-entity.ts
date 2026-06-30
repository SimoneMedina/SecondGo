import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { UsuarioOrmEntity } from './usuario.orm-entity';

@Entity('Compradores')
export class CompradorOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 25 })
  id_comprador: string;

  @OneToOne(() => UsuarioOrmEntity)
  @JoinColumn({ name: 'id_comprador' })
  Usuario: UsuarioOrmEntity;
}
