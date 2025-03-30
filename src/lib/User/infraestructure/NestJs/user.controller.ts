import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserGetAll } from '../../application/UserGetAll/UserGetAll';
import { UserGetOneById } from '../../application/UserGetOneById/UserGetOneById';
import { UserCreate } from '../../application/UserCreate/UserCreate';
import { UserEdit } from '../../application/UserEdit/UserEdit';
import { UserDelete } from '../../application/UserDelete/UserDelete';
import { Create, Edit, FindOneParams } from './pipes/validation';
import { UserNotFoundError } from '../../domain/UserNotFoundError';

@Controller('user')
export class UserController {
  constructor(
    @Inject('UserGetAll')
    private readonly userGetall: UserGetAll,
    @Inject('UserGetOneById')
    private readonly userGetOneById: UserGetOneById,
    @Inject('UserCreate')
    private readonly userCreate: UserCreate,
    @Inject('UserEdit')
    private readonly userEdit: UserEdit,
    @Inject('UserDelete')
    private readonly userDelete: UserDelete,
  ) {}

  @Get()
  async getAll() {
    return (await this.userGetall.run()).map((user) => user.toPlainObject());
  }

  @Get(':id')
  async getOneById(@Param() params: FindOneParams) {
    try {
      return (await this.userGetOneById.run(params.id)).toPlainObject();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return new NotFoundException();
      }
      throw error;
    }
  }

  @Post()
  async create(@Body() body: Create) {
    return await this.userCreate.run(
      body.id,
      body.name,
      body.email,
      new Date(),
    );
  }

  @Put()
  async edit(@Param() params: FindOneParams, @Body() body: Edit) {
    return await this.userEdit.run(
      params.id,
      body.name,
      body.email,
      new Date(),
    );
  }

  @Delete(':id')
  async delete(@Param() params: FindOneParams) {
    return await this.userDelete.run(params.id);
  }
}
