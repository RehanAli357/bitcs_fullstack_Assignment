import { IsEmail, IsNumber, IsString } from 'class-validator';

export class addCustomerDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
