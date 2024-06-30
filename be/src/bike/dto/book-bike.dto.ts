import { IsNumber } from "class-validator";
import { deleteBikeDto } from "./delete-bike.dto";

export class bookBike extends deleteBikeDto{
    @IsNumber()
    bTime:number;
}