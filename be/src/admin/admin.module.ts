import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entity/amin.entity';
import { GloablModule } from 'src/gloabl/gloabl.module';
import { CustomerModule } from 'src/customer/customer.module';
import { SellerModule } from 'src/seller/seller.module';

@Module({
  providers: [AdminService],
  controllers:[AdminController],
  imports:[TypeOrmModule.forFeature([Admin]),GloablModule,CustomerModule,SellerModule]
})
export class AdminModule {}
