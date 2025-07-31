import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtConfig } from './jwt.config';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  providers: [JwtConfig],
  exports: [NestJwtModule],
})
export class JwtModule {}
