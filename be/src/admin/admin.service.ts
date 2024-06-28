import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entity/amin.entity';
import { Repository } from 'typeorm';
import { GloablService } from 'src/gloabl/gloabl.service';
import { addUserDto } from 'src/gloabl/globalDto/add-user.dto';
import { loginUserDto } from 'src/gloabl/globalDto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import { authAdminInterface } from 'src/gloabl/interface/auth-admin.interface';
import { updateUserPasswordDto } from 'src/gloabl/globalDto/update-user.dto';
import { CustomerService } from 'src/customer/customer.service';
import { SellerService } from 'src/seller/seller.service';

export enum ERole {
  admin = 'admin1',
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private globalService: GloablService,
    private customerService: CustomerService,
    private sellerService: SellerService,
  ) {}

  async addAdmin(addAdminDto: addUserDto): Promise<object> {
    try {
      const admin = await this.globalService.addUser(addAdminDto, 'admin');
      await this.adminRepository.save(admin);
      return {
        message: 'Added Successfully',
        status: true,
      };
    } catch (error) {
      console.log(`Failed to add admin: ${error.message}`);
      throw new BadRequestException({
        message: 'Failed to add admin',
        status: false,
      });
    }
  }

  async validateUSer(loginAdminDto: loginUserDto): Promise<Admin> {
    const user = await this.adminRepository.findOne({
      where: { aEmail: loginAdminDto.email },
    });
    if (
      user &&
      (await this.globalService.compareHash(
        loginAdminDto.password,
        user.aPassword,
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

  async loginAdmin(user): Promise<Object> {
    try {
      const payload = { aId: user.aId, roleId: user.roleId };
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
      const aId = decoded.aId;
      const role = decoded.roleId;
      return { aId: aId, role: role };
    } catch (error) {
      console.log('Invalid Token :', error.message);
      throw new UnauthorizedException({
        message: 'Token is not valid',
        satus: false,
      });
    }
  }

  async getAdmin(user) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { aId: user.aId },
      });
      if (!admin) {
        throw new NotFoundException({
          message: 'admin not found',
          status: false,
        });
      }
      return admin;
    } catch (error) {
      console.log('Unable to fetch user:', error.message);
      throw new BadRequestException({
        message: 'Error in fetching user details',
        status: false,
      });
    }
  }

  async updatePassword(
    user: authAdminInterface,
    updateAdminPasswordDto: updateUserPasswordDto,
  ): Promise<object> {
    try {
      const data = await this.getAdmin(user);
      if (!data) {
        throw new NotFoundException({
          message: 'Admin not found',
          status: false,
        });
      } else {
        const isMatch = await this.globalService.updatePassword(
          updateAdminPasswordDto,
          data.aPassword,
        );
        if (isMatch === false) {
          throw new UnauthorizedException({
            message: 'Old Password is Invalid',
            status: false,
          });
        } else {
          await this.adminRepository.update(data.aId, {
            aPassword: isMatch,
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

  async deleteAdmin(
    user: authAdminInterface,
    loginSellerDto: loginUserDto,
  ): Promise<object> {
    try {
      const data = await this.getAdmin(user);
      if (!data) {
        throw new NotFoundException({
          message: 'Customer not found',
          status: false,
        });
      }
      const isMatch = await this.globalService.compareHash(
        loginSellerDto.password,
        data.aPassword,
      );

      if (!isMatch) {
        throw new UnauthorizedException({
          message: 'Password is Invalid',
          status: false,
        });
      }
      await this.adminRepository.delete(data.aId);
      return { message: 'User deleted successfully', status: true };
    } catch (error) {
      console.log('Error in deleting user:', error.message);
      throw new BadRequestException({
        message: 'Error in deleting user',
        status: false,
      });
    }
  }

  async fetchAllCustomer() {
    try {
      const data = await this.customerService.fetchAllCustomers();
      return data;
    } catch (error) {
      throw new BadRequestException({
        message: 'Error in fetching user ',
        status: false,
      });
    }
  }

  async fetchAllSeller(){
    try {
      const data = await this.sellerService.fetchAllSellers();
      return data
    } catch (error) {
      throw new BadRequestException({
        message: 'Error in fetching user ',
        status: false,
      });
    }
  }

}
