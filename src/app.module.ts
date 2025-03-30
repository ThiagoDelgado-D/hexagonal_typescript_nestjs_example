import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './lib/User/infraestructure/NestJs/user.module';
import { TUserEntity } from './lib/User/infraestructure/TypeOrm/UserEntity';
import { environment } from './lib/User/infraestructure/helpers/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [TUserEntity],
      synchronize: environment.isProduction ? false : true,
    }),
    TypeOrmModule.forFeature([TUserEntity]),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
