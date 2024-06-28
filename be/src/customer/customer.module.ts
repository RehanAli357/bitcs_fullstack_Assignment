import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entity/customers.entity';
import { GloablModule } from 'src/gloabl/gloabl.module';

@Module({
  providers: [CustomerService],
  controllers:[CustomerController],
  imports:[TypeOrmModule.forFeature([Customer]),GloablModule],
  exports:[CustomerService]
})
export class CustomerModule {}
