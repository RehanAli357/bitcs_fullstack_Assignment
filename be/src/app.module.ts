import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/entity/customers.entity';
import { GloablModule } from './gloabl/gloabl.module';
import { SellerModule } from './seller/seller.module';
import { Seller } from './seller/entity/sellers.entity';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/entity/amin.entity';
import { BikeModule } from './bike/bike.module';
import { Bike } from './bike/entity/bikes.entity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './DB/bikeRenalDB.db',
      entities: [Customer,Seller,Admin,Bike],
      synchronize: false, //make it true while in production
    }),
    CustomerModule,
    GloablModule,
    SellerModule,
    AdminModule,
    BikeModule,
  ],
  controllers: [],
})
export class AppModule {}
