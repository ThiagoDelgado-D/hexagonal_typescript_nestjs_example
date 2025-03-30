import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/UserRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { TUserEntity } from './UserEntity';
import { User } from '../../domain/User';
import { UserId } from '../../domain/UserId';
import { UserName } from '../../domain/UserName';
import { UserEmail } from '../../domain/UserEmail';
import { UserCreatedAt } from '../../domain/UserCreatedAt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TUserRepository implements UserRepository {
  constructor(
    @InjectRepository(TUserEntity)
    private readonly repository: Repository<TUserEntity>,
  ) {}

  private mapToDomain(TUser: TUserEntity) {
    return new User(
      new UserId(TUser.id),
      new UserName(TUser.name),
      new UserEmail(TUser.email),
      new UserCreatedAt(TUser.createdAt),
    );
  }

  async getAll() {
    const users = await this.repository.find();
    return users.map((user) => this.mapToDomain(user));
  }
  async getOneById(id: UserId): Promise<User | null> {
    const user = await this.repository.findOne({
      where: {
        id: id.value,
      },
    });

    if (!user) return null;
    return this.mapToDomain(user);
  }

  async create(user: User): Promise<void> {
    await this.repository.save({
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      createdAt: user.createdAt.value,
    });
  }
  async edit(user: User): Promise<void> {
    await this.repository.update(user.id.value, {
      name: user.name.value,
      email: user.email.value,
      createdAt: user.createdAt.value,
    });
  }
  async delete(id: UserId): Promise<void> {
    await this.repository.delete(id.value);
  }
}
