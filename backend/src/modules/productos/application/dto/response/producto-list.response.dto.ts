import { ProductoResponseDto } from './producto.response.dto';

export class ProductoListResponseDto {
  productos: ProductoResponseDto[];
  total: number;
}
