import { IsEmail, IsNumber, IsString } from 'class-validator';

export class addUserDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
