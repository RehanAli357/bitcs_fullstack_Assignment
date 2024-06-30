import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entity/sellers.entity';
import { GloablModule } from 'src/gloabl/gloabl.module';
import { BikeModule } from 'src/bike/bike.module';
import { SellerPaymentService } from './sellerPayment.service';

@Module({
  providers: [SellerService,SellerPaymentService],
  controllers: [SellerController],
  imports:[TypeOrmModule.forFeature([Seller]),GloablModule,BikeModule],
  exports:[SellerService,SellerPaymentService]
})
export class SellerModule {}
