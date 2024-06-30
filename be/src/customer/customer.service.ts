import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entity/customers.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { GloablService } from 'src/gloabl/gloabl.service';
import { authUserInterface } from '../gloabl/interface/auth-user.interface';
import { addUserDto } from 'src/gloabl/globalDto/add-user.dto';
import { loginUserDto } from 'src/gloabl/globalDto/login-user.dto';
import { updateUserPasswordDto } from 'src/gloabl/globalDto/update-user.dto';
import { BikeService } from 'src/bike/bike.service';
import { bookBike } from 'src/bike/dto/book-bike.dto';
import { deleteBikeDto } from 'src/bike/dto/delete-bike.dto';

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
    @Inject(forwardRef(() => BikeService))
    private BikeService: BikeService,
  ) {}

  async addCustomer(addCustomerDto: addUserDto): Promise<Object> {
    try {
      const customer = await this.globalService.addUser(
        addCustomerDto,
        'customer',
      );
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

  async validateUSer(loginCustomerDto: loginUserDto): Promise<Customer> {
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
        expiresIn: '1d',
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
    updateCustomerPasswordDto: updateUserPasswordDto,
  ): Promise<object> {
    try {
      const data = await this.getCustomer(user);
      if (!data) {
        throw new NotFoundException({
          message: 'Customer not found',
          status: false,
        });
      } else {
        const isMatch = await this.globalService.updatePassword(
          updateCustomerPasswordDto,
          data.cPassword,
        );
        if (isMatch === false) {
          throw new UnauthorizedException({
            message: 'Old Password is Invalid',
            status: false,
          });
        } else {
          await this.customerRepository.update(user.cId, {
            cPassword: isMatch,
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
    loginCustomerDto: loginUserDto,
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

  async fetchAllCustomers(): Promise<Customer[]> {
    try {
      return await this.customerRepository.find();
    } catch (error) {
      console.log('Error in Fetching users:', error.message);
      throw new BadRequestException({
        message: 'Error in Fetching user',
        status: false,
      });
    }
  }

  async getAllBike() {
    try {
      return await this.BikeService.getAllBike();
    } catch (error) {
      console.log('Error in Fetching bikes data:', error.message);
      throw new BadRequestException({
        message: 'Error in Fetching bikes data',
        status: false,
      });
    }
  }

  async bookBike(user: authUserInterface, bikeIdDto: bookBike) {
    try {
      let data = await this.BikeService.bookBike(user, bikeIdDto);
      if (data) {
        return true;
      }
      return false;
    } catch (error) {
      throw new BadRequestException({
        message: 'Unable to book a bike at this moment',
        status: false,
      });
    }
  }

  async returnBike(user: authUserInterface, bikeDto: deleteBikeDto) {
    try {
      await this.BikeService.returnBike(user.cId, bikeDto.bId);
    } catch (error) {
      throw new BadRequestException({
        message: 'Failing to return a bike at this moment',
        status: false,
      });
    }
  }
}
