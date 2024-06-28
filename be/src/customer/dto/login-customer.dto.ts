import { IsEmail, IsString } from 'class-validator';

export class loginCustomerDto {
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
