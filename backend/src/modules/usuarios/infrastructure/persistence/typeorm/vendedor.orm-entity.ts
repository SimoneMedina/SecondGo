import {
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  OneToOne as OneToOneRelation,
} from 'typeorm';
import { UsuarioOrmEntity } from './usuario.orm-entity';
import { TiendaOrmEntity } from '../../../../tiendas/infrastructure/persistence/typeorm/tienda.orm-entity';

@Entity('Vendedores')
export class VendedorOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_vendedor: string;

  @OneToOne(() => UsuarioOrmEntity)
  @JoinColumn({ name: 'id_vendedor' })
  Usuario: UsuarioOrmEntity;

  @OneToOneRelation(() => TiendaOrmEntity, (t) => t.Vendedor)
  Tienda?: TiendaOrmEntity;
}
