import { TiendaResponseDto } from './tienda.response.dto';
import { ProductoResponseDto } from '../../../../productos/application/dto/response/producto.response.dto';

export class ResenaTiendaDetalleDto {
  id?: string;
  calificacion: number;
  comentario: string;
  compradorNombre?: string;
}

export class TiendaDetalleResponseDto {
  tienda: TiendaResponseDto;
  productos: ProductoResponseDto[];
  resenas: ResenaTiendaDetalleDto[];
  promedioResenas: number;
}