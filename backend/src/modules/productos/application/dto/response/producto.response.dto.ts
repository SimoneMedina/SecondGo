export class ProductoResponseDto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaPublicacion?: Date | null;
  color: string;
  hexColor?: string | null;
  grupoColor?: string | null;
  tipoPrenda?: string | null;
  estilo?: string | null;
  talla?: string | null;
  estado: string;
  usuarioTienda: string;
  tiendaId?: string;
  tiendaNombre?: string;
  compradorSolicitanteId?: string | null;
  fotos?: string[];
}