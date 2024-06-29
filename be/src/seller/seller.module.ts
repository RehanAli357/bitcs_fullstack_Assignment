import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entity/sellers.entity';
import { GloablModule } from 'src/gloabl/gloabl.module';
import { BikeModule } from 'src/bike/bike.module';

@Module({
  providers: [SellerService],
  controllers: [SellerController],
  imports:[TypeOrmModule.forFeature([Seller]),GloablModule,BikeModule],
  exports:[SellerService]
})
export class SellerModule {}
