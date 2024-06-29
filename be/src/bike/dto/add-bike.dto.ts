import { Optional } from '@nestjs/common';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class addBikeDto {
  @IsString()
  bName: string;

  @IsString()
  bType: string;

  @IsNumber()
  bPrice: number;

  @IsNumber()
  bDistance:number;

  @IsBoolean()
  available:boolean;

  @Optional()
  @IsString()
  bImage:string
}
