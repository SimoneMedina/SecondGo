export type TipoUsuario = 'comprador' | 'vendedor';

export interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  ubicacion?: string;
  tipo_usuario: TipoUsuario;
}

export interface AuthResponse {
  access_token: string;
  usuario: {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
    tipo_usuario: TipoUsuario;
  };
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaPublicacion: string;
  color: string;
  talla?: string;
  fotos: string[];
  estado: string;
  tiendaId: string;
  tiendaNombre?: string;
}

export interface ProductoListResponse {
  productos: Producto[];
  total: number;
}

export interface Tienda {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
  ubicacion?: string;
  logo?: string;
  idVendedor: string;
  cantidadProductos?: number;
}

export interface Resena {
  id: string;
  calificacion: string;
  valor: number;
  descripcion: string;
  compradorId: string;
  compradorNombre?: string;
  tiendaId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
