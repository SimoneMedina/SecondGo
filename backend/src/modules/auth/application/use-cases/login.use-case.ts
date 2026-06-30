import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthRepository } from '../../domain/interfaces/auth.repository.interface';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { AuthResponseDto } from '../dto/response/auth.response.dto';
import { LoginRequestDto } from '../dto/request/login.request.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const usuario = await this.authRepository.findByEmail(dto.correo.toLowerCase());
    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.contrasena_usuario);
    if (!passwordValida) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

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
