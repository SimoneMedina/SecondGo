export class TiendaEntity {
  usuario_tienda: string;
  nombre_local: string;
  descripcion_tienda: string;
  fecha_creacion_tienda: Date;
  ubicacion_tienda: number;
  logo_local?: Buffer;
  ruc_local?: string;
  id_vendedor: string;
}
