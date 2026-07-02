export class ProductoResponseDto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaPublicacion: Date;
  color: string;
  talla?: string;
  fotos: string[];
  estado: string;
  tiendaId: string;
  tiendaNombre?: string;
}
