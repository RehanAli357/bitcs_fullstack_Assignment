import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/entity/customers.entity';
import { GloablModule } from './gloabl/gloabl.module';
import { SellerModule } from './seller/seller.module';
import { Seller } from './seller/entity/sellers.entity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './DB/bikeRenalDB.db',
      entities: [Customer,Seller],
      synchronize: false, //make it true while in production
    }),
    CustomerModule,
    GloablModule,
    SellerModule,
  ],
  controllers: [],
})
export class AppModule {}
