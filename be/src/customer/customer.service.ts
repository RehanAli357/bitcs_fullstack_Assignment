import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entity/customers.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { GloablService } from 'src/gloabl/gloabl.service';
import { authUserInterface } from './interface/auth-user.interface';
import { addCustomerDto } from './dto/add-customer.dto';
import { loginCustomerDto } from './dto/login-customer.dto';
import { updateCustomerPasswordDto } from './dto/update-customer.dto';

export enum ERole {
  customer = 'cus001',
  admin = 'adm001',
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    private globalService: GloablService,
  ) {}

  async addCustomer(addCustomerDto: addCustomerDto): Promise<Object> {
    try {
      const hashPassword = await this.globalService.createHash(
        addCustomerDto.password,
      );
      const customer = {
        cId: uuidv4(),
        cName: addCustomerDto.name,
        cEmail: addCustomerDto.email,
        cPassword: hashPassword,
        roleId: process.env.CUSTOMER_ROLE,
        createdTime: new Date(),
      };
      await this.customerRepository.save(customer);
      return {
        message: 'Added Successfully',
        status: true,
      };
    } catch (error) {
      console.log(`Failed to add customer: ${error.message}`);
      throw new BadRequestException({
        message: 'Failed to add customer',
        status: false,
      });
    }
  }

  async validateUSer(loginCustomerDto: loginCustomerDto): Promise<Customer> {
    const user = await this.customerRepository.findOne({
      where: { cEmail: loginCustomerDto.email },
    });
    if (
      user &&
      (await this.globalService.compareHash(
        loginCustomerDto.password,
        user.cPassword,
      ))
    ) {
      return user;
    } else {
      throw new UnauthorizedException({
        message: 'Email or Password is not valid',
        status: false,
      });
    }
  }

  async loginCustomer(user): Promise<Object> {
    try {
      const payload = { cId: user.cId, roleId: user.roleId };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '60m',
      });
      return {
        access_token: token,
        status: true,
      };
    } catch (error) {
      console.log('Access token Error :', error.message);
      throw new BadRequestException({
        message: 'Unable to Generate Token',
        status: false,
      });
    }
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const cId = decoded.cId;
      const role = decoded.roleId;
      return { cId: cId, role: role };
    } catch (error) {
      console.log('Invalid Token :', error.message);
      throw new UnauthorizedException({
        message: 'Token is not valid',
        satus: false,
      });
    }
  }

  async getCustomer(user: authUserInterface): Promise<Customer> {
    try {
      const customer = await this.customerRepository.findOne({
        where: { cId: user.cId },
      });
      if (!customer) {
        throw new NotFoundException({
          message: 'Customer not found',
          status: false,
        });
      }
      return customer;
    } catch (error) {
      console.log('Unable to fetch user:', error.message);
      throw new BadRequestException({
        message: 'Error in fetching user details',
        status: false,
      });
    }
  }

  async updatePassword(
    user: authUserInterface,
    updateCustomerPasswordDto: updateCustomerPasswordDto,
  ): Promise<object> {
    try {
      const data = await this.getCustomer(user);
      if (!data) {
        throw new NotFoundException({
          message: 'Customer not found',
          status: false,
        });
      } else {
        const isMatch = await this.globalService.compareHash(
          updateCustomerPasswordDto.oldPassword,
          data.cPassword,
        );
        if (!isMatch) {
          throw new UnauthorizedException({
            message: 'Old Password is Invalid',
            status: false,
          });
        } else {
          const hashPassword = await this.globalService.createHash(
            updateCustomerPasswordDto.newPassword,
          );
          await this.customerRepository.update(user.cId, {
            cPassword: hashPassword,
          });
        }
      }
      return { message: 'Password updated successfully', status: true };
    } catch (error) {
      console.log('Error in updating Password:', error.message);
      throw new BadRequestException({
        message: 'Error in updating Password',
        status: false,
      });
    }
  }

  async deleteCustomer(
    user: authUserInterface,
    loginCustomerDto: loginCustomerDto,
  ): Promise<object> {
    try {
      const data = await this.getCustomer(user);
      if (!data) {
        throw new NotFoundException({
          message: 'Customer not found',
          status: false,
        });
      }

      const isMatch = await this.globalService.compareHash(
        loginCustomerDto.password,
        data.cPassword,
      );

      if (!isMatch) {
        throw new UnauthorizedException({
          message: 'Password is Invalid',
          status: false,
        });
      }

      await this.customerRepository.delete(data.cId);

      return { message: 'User deleted successfully', status: true };
    } catch (error) {
      console.log('Error in deleting user:', error.message);
      throw new BadRequestException({
        message: 'Error in deleting user',
        status: false,
      });
    }
  }
}
