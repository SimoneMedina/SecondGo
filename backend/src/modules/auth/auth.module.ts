import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { IAuthRepository } from './domain/interfaces/auth.repository.interface';
import { AuthTypeOrmRepository } from './infrastructure/persistence/auth.typeorm-repository';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { UsuarioOrmEntity } from '../usuarios/infrastructure/persistence/typeorm/usuario.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'SecondGo_JWT_SuperSecretKey_2026_Migration',
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '60m',
        } as any,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    JwtStrategy,
    {
      provide: IAuthRepository,
      useClass: AuthTypeOrmRepository,
    },
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
