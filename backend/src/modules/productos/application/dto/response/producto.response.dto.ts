export class ProductoResponseDto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaPublicacion: Date;
  color: string;
  talla?: string;
  dimensiones: string;
  foto?: string;
  estado: string;
  tiendaId: string;
  tiendaNombre?: string;
}
