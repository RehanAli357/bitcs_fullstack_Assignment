import { Module, forwardRef } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entity/customers.entity';
import { GloablModule } from 'src/gloabl/gloabl.module';
import { BikeModule } from 'src/bike/bike.module';
import { CustomerPayment } from './entity/customerPayment.entity';
import { CustomerPaymentService } from './customerPayment.service';

@Module({
  providers: [CustomerService, CustomerPaymentService],
  controllers: [CustomerController],
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerPayment]),
    GloablModule,
    forwardRef(() => BikeModule),
  ],
  exports: [CustomerService, CustomerPaymentService],
})
export class CustomerModule {}
