export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  rol: 'comprador' | 'vendedor';
}
