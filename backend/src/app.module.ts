import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { TiendasModule } from './modules/tiendas/tiendas.module';
import { ProductosModule } from './modules/productos/productos.module';
import { ResenasModule } from './modules/resenas/resenas.module';
import { UsuarioOrmEntity } from './modules/usuarios/infrastructure/persistence/typeorm/usuario.orm-entity';
import { VendedorOrmEntity } from './modules/usuarios/infrastructure/persistence/typeorm/vendedor.orm-entity';
import { CompradorOrmEntity } from './modules/usuarios/infrastructure/persistence/typeorm/comprador.orm-entity';
import { TiendaOrmEntity } from './modules/tiendas/infrastructure/persistence/typeorm/tienda.orm-entity';
import { ProductoOrmEntity } from './modules/productos/infrastructure/persistence/typeorm/producto.orm-entity';
import { FotoProductoOrmEntity } from './modules/productos/infrastructure/persistence/typeorm/foto-producto.orm-entity';
import { ResenaOrmEntity } from './modules/resenas/infrastructure/persistence/typeorm/resena.orm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          UsuarioOrmEntity,
          VendedorOrmEntity,
          CompradorOrmEntity,
          TiendaOrmEntity,
          ProductoOrmEntity,
          FotoProductoOrmEntity,
          ResenaOrmEntity,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsuariosModule,
    TiendasModule,
    ProductosModule,
    ResenasModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
