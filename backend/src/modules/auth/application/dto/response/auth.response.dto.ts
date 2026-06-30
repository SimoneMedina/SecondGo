export class AuthResponseDto {
  access_token: string;
  usuario: {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
  };
}
