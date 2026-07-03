import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Ubicaciones')
export class UbicacionOrmEntity {
  @PrimaryGeneratedColumn()
  id_ubicacion: number;

  @Column({ type: 'float' })
  latitud: number;

  @Column({ type: 'float' })
  longitud: number;

  @Column({ type: 'varchar', length: 250, nullable: true })
  direccion: string | null;
}