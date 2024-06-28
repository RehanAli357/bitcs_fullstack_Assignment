import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/entity/customers.entity';
import { GloablModule } from './gloabl/gloabl.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './DB/bikeRenalDB.db',
      entities: [Customer],
      synchronize: false, //make it true while in production
    }),
    CustomerModule,
    GloablModule,
  ],
})
export class AppModule {}
