export class TiendaResponseDto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  ubicacion: number;
  logo?: string;
  ruc?: string;
  idVendedor: string;
  cantidadProductos?: number;
}
