import { Module, forwardRef } from '@nestjs/common';
import { BikeService } from './bike.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './entity/bikes.entity';
import { BikeTaken } from './entity/bikeTaken.entity';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  providers: [BikeService],
  imports: [
    TypeOrmModule.forFeature([Bike, BikeTaken]),
    forwardRef(() => CustomerModule),
  ],
  exports: [BikeService],
})
export class BikeModule {}
