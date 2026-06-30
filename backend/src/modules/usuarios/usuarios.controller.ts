import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ObtenerUsuariosUseCase } from './application/use-cases/obtener-usuarios.use-case';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(
    private readonly obtenerUsuariosUseCase: ObtenerUsuariosUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.obtenerUsuariosUseCase.executeAll();
  }

  @Get('compradores')
  async findCompradores() {
    return this.obtenerUsuariosUseCase.executeCompradores();
  }
}
