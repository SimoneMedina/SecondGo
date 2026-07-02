export class TiendaResponseDto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  ubicacion?: string;
  logo?: string;
  idVendedor: string;
  cantidadProductos?: number;
}
