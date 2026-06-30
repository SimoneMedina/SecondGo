import { Injectable } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/interfaces/usuario.repository.interface';
import { UsuarioResponseDto } from '../dto/response/usuario.response.dto';
import { CompradorResponseDto } from '../dto/response/comprador.response.dto';
import { UsuarioMapper } from '../mappers/usuario.mapper';

@Injectable()
export class ObtenerUsuariosUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async executeAll(): Promise<UsuarioResponseDto[]> {
    const orms = await this.usuarioRepository.findAll();
    return orms.map(UsuarioMapper.ormToResponse);
  }

  async executeCompradores(): Promise<CompradorResponseDto[]> {
    const compradores = await this.usuarioRepository.findCompradoresWithUsuarios();
    return compradores.map((c: any) => ({
      id: c.id_comprador,
      usuario: UsuarioMapper.ormToResponse(c.Usuario),
    }));
  }
}
