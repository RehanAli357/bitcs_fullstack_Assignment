import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerPayment } from './entity/customerPayment.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CustomerPaymentService {
  constructor(
    @InjectRepository(CustomerPayment)
    private CustomerPaymentRepository: Repository<CustomerPayment>,
  ) {}

  async addPayment(cId: string, bId: string, payment: number, bTime: number) {
    try {
      const data = {
        cpId: uuidv4(),
        payment: payment,
        cId: cId,
        bId: bId,
        bTime: bTime,
        createdTime: new Date(),
      };
      await this.CustomerPaymentRepository.save(data);
      return true;
    } catch (error) {
      console.log('Unable to add paymentCustomer data:', error.message);
      return false;
    }
  }

  async fetchPayment(cId: string) {
    try {
      return await this.CustomerPaymentRepository.find({ where: { cId: cId } });
    } catch (error) {
      console.log('Unable to add paymentCustomer data:', error.message);
      return false;
    }
  }
  async fetchAllCustomerRevenue() {
    try {
      const totalRevenue =
        await this.CustomerPaymentRepository.createQueryBuilder('payment')
          .select('SUM(payment)', 'sum')
          .getRawOne();

      return totalRevenue.sum;
    } catch (error) {
      console.log('Unable to fetch Customers total revenue:', error.message);
      return false;
    }
  }

  async FetchCustomerDetailsRevenue() {
    try {
      const data = await this.CustomerPaymentRepository.find();
      return data;
    } catch (error) {
      console.log('Unable to fetch Customers total revenue:', error.message);
      return false;
    }
  }
}
