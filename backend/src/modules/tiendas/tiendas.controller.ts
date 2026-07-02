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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CrearTiendaUseCase } from './application/use-cases/crear-tienda.use-case';
import { ObtenerTiendasUseCase } from './application/use-cases/obtener-tiendas.use-case';
import { EditarTiendaUseCase } from './application/use-cases/editar-tienda.use-case';
import { EliminarTiendaUseCase } from './application/use-cases/eliminar-tienda.use-case';
import { CreateTiendaRequestDto } from './application/dto/request/create-tienda.request.dto';
import { UpdateTiendaRequestDto } from './application/dto/request/update-tienda.request.dto';
import { UploadedStorageFile } from '../storage/storage.service';

interface AuthenticatedRequest {
  user: {
    id_usuario: string;
    rol?: 'comprador' | 'vendedor';
  };
}

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
  async miTienda(@Req() req: AuthenticatedRequest) {
    return this.obtenerTiendasUseCase.executeByVendedor(req.user.id_usuario);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.obtenerTiendasUseCase.executeById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() dto: CreateTiendaRequestDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() logo?: UploadedStorageFile,
  ) {
    return this.crearTiendaUseCase.execute(dto, req.user.id_usuario, logo);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTiendaRequestDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() logo?: UploadedStorageFile,
  ) {
    return this.editarTiendaUseCase.execute(id, dto, logo);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eliminarTiendaUseCase.execute(id);
  }
}
