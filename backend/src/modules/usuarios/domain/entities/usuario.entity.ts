export interface UsuarioEntity {
  id_usuario: string;
  nombres_usuario: string;
  apellidos_usuario: string;
  correo_usuario: string;
  contrasena_usuario: string;
  ubicacion_usuario: number | null;
  foto_usuario: string | null;
}