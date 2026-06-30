import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CrearResenaUseCase } from './application/use-cases/crear-resena.use-case';
import { ObtenerResenasUseCase } from './application/use-cases/obtener-resenas.use-case';
import { EliminarResenaUseCase } from './application/use-cases/eliminar-resena.use-case';
import { CreateResenaRequestDto } from './application/dto/request/create-resena.request.dto';

@Controller('resenas')
@UseGuards(JwtAuthGuard)
export class ResenasController {
  constructor(
    private readonly crearResenaUseCase: CrearResenaUseCase,
    private readonly obtenerResenasUseCase: ObtenerResenasUseCase,
    private readonly eliminarResenaUseCase: EliminarResenaUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.obtenerResenasUseCase.executeAll();
  }

  @Get('tienda/:usuarioTienda')
  async findByTienda(@Param('usuarioTienda') usuarioTienda: string) {
    return this.obtenerResenasUseCase.executeByTienda(usuarioTienda);
  }

  @Post()
  async create(
    @Body() dto: CreateResenaRequestDto,
    @Req() req: any,
  ) {
    return this.crearResenaUseCase.execute(dto, req.user.id_usuario);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eliminarResenaUseCase.execute(id);
  }
}
