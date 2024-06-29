import { Module } from '@nestjs/common';
import { BikeService } from './bike.service';
import { BikeController } from './bike.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './entity/bikes.entity';

@Module({
  providers: [BikeService],
  controllers:[BikeController],
  imports:[TypeOrmModule.forFeature([Bike])],
  exports:[BikeService]
})
export class BikeModule {}
