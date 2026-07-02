import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'SecondGo_JWT_SuperSecretKey_2026_Migration',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id_usuario: payload.sub,
      correo: payload.email,
      nombre: payload.name,
      rol: payload.rol,
    };
  }
}
