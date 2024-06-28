import { IsEmail, IsString } from 'class-validator';

export class loginUserDto {
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
