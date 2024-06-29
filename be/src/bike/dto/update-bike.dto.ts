import { addBikeDto } from './add-bike.dto';
import { IsString } from 'class-validator';

export class updateBikeDto extends addBikeDto {
  @IsString()
  bId: string;
}
