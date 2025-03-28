import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './lib/User/infraestructure/NestJs/user.module';
import { TUserEntity } from './lib/User/infraestructure/TypeOrm/UserEntity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [TUserEntity],
      }),
    }),
    TypeOrmModule.forFeature([TUserEntity]),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
