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
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CrearTiendaUseCase } from './application/use-cases/crear-tienda.use-case';
import { ObtenerTiendasUseCase } from './application/use-cases/obtener-tiendas.use-case';
import { EditarTiendaUseCase } from './application/use-cases/editar-tienda.use-case';
import { EliminarTiendaUseCase } from './application/use-cases/eliminar-tienda.use-case';
import { ObtenerDetalleTiendaUseCase } from './application/use-cases/obtener-detalle-tienda.use-case';
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
    private readonly obtenerDetalleTiendaUseCase: ObtenerDetalleTiendaUseCase,
  ) {}

  @Get()
  async findAll() {
    return {
      data: await this.obtenerTiendasUseCase.executeAll(),
    };
  }

  @Get('mi-tienda')
  async miTienda(@Req() req: AuthenticatedRequest) {
    return {
      data: await this.obtenerTiendasUseCase.executeByVendedor(req.user.id_usuario),
    };
  }

  @Get(':id/detalle')
  async detalle(@Param('id') id: string) {
    return {
      data: await this.obtenerDetalleTiendaUseCase.execute(id),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.obtenerTiendasUseCase.executeById(id),
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() dto: CreateTiendaRequestDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() logo?: UploadedStorageFile,
  ) {
    if (req.user.rol !== 'vendedor') {
      throw new ForbiddenException('Solo los vendedores pueden crear tiendas');
    }

    return {
      data: await this.crearTiendaUseCase.execute(dto, req.user.id_usuario, logo),
    };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTiendaRequestDto,
    @UploadedFile() logo?: UploadedStorageFile,
  ) {
    return {
      data: await this.editarTiendaUseCase.execute(id, dto, logo),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.eliminarTiendaUseCase.execute(id),
    };
  }
}