import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class TUserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;
}
