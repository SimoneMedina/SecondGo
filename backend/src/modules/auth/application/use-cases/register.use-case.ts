import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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
    const existente = await this.authRepository.findByEmail(dto.correo_usuario.toLowerCase());
    if (existente) {
      throw new ConflictException('El correo ya está registrado');
    }

    const existenteId = await this.authRepository.findById(dto.id_usuario);
    if (existenteId) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(dto.contrasena_usuario, 10);

    const usuario = await this.authRepository.create({
      id_usuario: dto.id_usuario,
      nombres_usuario: dto.nombres_usuario,
      apellidos_usuario: dto.apellidos_usuario,
      correo_usuario: dto.correo_usuario.toLowerCase(),
      contrasena_usuario: hashedPassword,
      ubicacion_usuario: dto.ubicacion_usuario,
    });

    const payload: JwtPayload = {
      sub: usuario.id_usuario,
      email: usuario.correo_usuario,
      name: `${usuario.nombres_usuario} ${usuario.apellidos_usuario}`,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id_usuario,
        nombres: usuario.nombres_usuario,
        apellidos: usuario.apellidos_usuario,
        correo: usuario.correo_usuario,
      },
    };
  }
}
