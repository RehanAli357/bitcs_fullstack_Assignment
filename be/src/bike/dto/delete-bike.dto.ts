import { IsString } from 'class-validator';

export class deleteBikeDto {
  @IsString()
  bId: string;
}
