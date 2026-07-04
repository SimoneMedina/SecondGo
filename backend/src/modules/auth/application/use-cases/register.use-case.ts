import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { IAuthRepository } from '../../domain/interfaces/auth.repository.interface';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { AuthResponseDto } from '../dto/response/auth.response.dto';
import { RegisterRequestDto } from '../dto/request/register.request.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const existente = await this.authRepository.findByEmail(
      dto.correo_usuario.toLowerCase(),
    );

    if (existente) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.contrasena_usuario, 10);
    const idUsuario = randomUUID();

    const usuario = await this.authRepository.create(
      {
        id_usuario: idUsuario,
        nombres_usuario: dto.nombres_usuario,
        apellidos_usuario: dto.apellidos_usuario,
        correo_usuario: dto.correo_usuario.toLowerCase(),
        contrasena_usuario: hashedPassword,
        ubicacion_usuario: null,
        foto_usuario: null,
      },
      dto.tipo_usuario,
    );

    const rol = usuario.Vendedor ? 'vendedor' : 'comprador';

    const payload: JwtPayload = {
      sub: usuario.id_usuario,
      email: usuario.correo_usuario,
      name: `${usuario.nombres_usuario} ${usuario.apellidos_usuario}`,
      rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id_usuario,
        nombres: usuario.nombres_usuario,
        apellidos: usuario.apellidos_usuario,
        correo: usuario.correo_usuario,
        tipo_usuario: rol,
      },
    };
  }
}
