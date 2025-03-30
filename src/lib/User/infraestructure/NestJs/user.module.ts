import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserGetAll } from '../../application/UserGetAll/UserGetAll';
import { UserGetOneById } from '../../application/UserGetOneById/UserGetOneById';
import { UserCreate } from '../../application/UserCreate/UserCreate';
import { UserEdit } from '../../application/UserEdit/UserEdit';
import { UserDelete } from '../../application/UserDelete/UserDelete';
import { createProvider } from '../helpers/createProvider';
import { TUserRepository } from '../TypeOrm/UserRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TUserEntity } from '../TypeOrm/UserEntity';

@Module({
  imports: [TypeOrmModule.forFeature([TUserEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TUserRepository,
    },
    createProvider('UserGetAll', UserGetAll, 'UserRepository'),
    createProvider('UserGetOneById', UserGetOneById, 'UserRepository'),
    createProvider('UserCreate', UserCreate, 'UserRepository'),
    createProvider('UserEdit', UserEdit, 'UserRepository'),
    createProvider('UserDelete', UserDelete, 'UserRepository'),
  ],
})
export class UserModule {}
