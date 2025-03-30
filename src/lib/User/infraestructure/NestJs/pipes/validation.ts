import { IsEmail, IsString } from 'class-validator';

export class FindOneParams {
  @IsString()
  id: string;
}

export class Create {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

export class Edit {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
