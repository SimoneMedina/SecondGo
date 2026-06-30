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
import { CrearProductoUseCase } from './application/use-cases/crear-producto.use-case';
import { ObtenerProductosUseCase } from './application/use-cases/obtener-productos.use-case';
import { EditarProductoUseCase } from './application/use-cases/editar-producto.use-case';
import { EliminarProductoUseCase } from './application/use-cases/eliminar-producto.use-case';
import { CreateProductoRequestDto } from './application/dto/request/create-producto.request.dto';
import { UpdateProductoRequestDto } from './application/dto/request/update-producto.request.dto';

@Controller('productos')
@UseGuards(JwtAuthGuard)
export class ProductosController {
  constructor(
    private readonly crearProductoUseCase: CrearProductoUseCase,
    private readonly obtenerProductosUseCase: ObtenerProductosUseCase,
    private readonly editarProductoUseCase: EditarProductoUseCase,
    private readonly eliminarProductoUseCase: EliminarProductoUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.obtenerProductosUseCase.executeAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.obtenerProductosUseCase.executeById(id);
  }

  @Get('tienda/:usuarioTienda')
  async findByTienda(@Param('usuarioTienda') usuarioTienda: string) {
    return this.obtenerProductosUseCase.executeByTienda(usuarioTienda);
  }

  @Post()
  async create(
    @Body() dto: CreateProductoRequestDto,
    @Req() req: any,
  ) {
    const usuarioTienda = req.user.id_usuario;
    return this.crearProductoUseCase.execute(dto, usuarioTienda);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductoRequestDto,
  ) {
    return this.editarProductoUseCase.execute(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eliminarProductoUseCase.execute(id);
  }
}
