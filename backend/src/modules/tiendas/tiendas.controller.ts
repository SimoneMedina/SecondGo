import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CrearTiendaUseCase } from './application/use-cases/crear-tienda.use-case';
import { ObtenerTiendasUseCase } from './application/use-cases/obtener-tiendas.use-case';
import { EditarTiendaUseCase } from './application/use-cases/editar-tienda.use-case';
import { EliminarTiendaUseCase } from './application/use-cases/eliminar-tienda.use-case';
import { CreateTiendaRequestDto } from './application/dto/request/create-tienda.request.dto';
import { UpdateTiendaRequestDto } from './application/dto/request/update-tienda.request.dto';

@Controller('tiendas')
@UseGuards(JwtAuthGuard)
export class TiendasController {
  constructor(
    private readonly crearTiendaUseCase: CrearTiendaUseCase,
    private readonly obtenerTiendasUseCase: ObtenerTiendasUseCase,
    private readonly editarTiendaUseCase: EditarTiendaUseCase,
    private readonly eliminarTiendaUseCase: EliminarTiendaUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.obtenerTiendasUseCase.executeAll();
  }

  @Get('mi-tienda')
  async miTienda(@Req() req: any) {
    return this.obtenerTiendasUseCase.executeByVendedor(req.user.id_usuario);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.obtenerTiendasUseCase.executeById(id);
  }

  @Post()
  async create(
    @Body() dto: CreateTiendaRequestDto,
    @Req() req: any,
  ) {
    return this.crearTiendaUseCase.execute(dto, req.user.id_usuario);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTiendaRequestDto,
    @Req() req: any,
  ) {
    return this.editarTiendaUseCase.execute(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eliminarTiendaUseCase.execute(id);
  }
}
