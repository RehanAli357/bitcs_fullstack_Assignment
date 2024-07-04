import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { addUserDto } from 'src/gloabl/globalDto/add-user.dto';
import { Repository } from 'typeorm';
import { Seller } from './entity/sellers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GloablService } from 'src/gloabl/gloabl.service';
import { loginUserDto } from 'src/gloabl/globalDto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import { updateUserPasswordDto } from 'src/gloabl/globalDto/update-user.dto';
import { authSellerInterface } from 'src/gloabl/interface/auth-seller.interface';
import { addBikeDto } from 'src/bike/dto/add-bike.dto';
import { BikeService } from 'src/bike/bike.service';
import { updateBikeDto } from 'src/bike/dto/update-bike.dto';
import { SellerPaymentService } from './sellerPayment.service';

export enum ERole {
  seller = 'sel001',
  admin = 'adm001',
}

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    private globalService: GloablService,
    private bikeService: BikeService,
    private SellerPaymentService : SellerPaymentService
  ) {}

  async addSeller(addSellerDto: addUserDto): Promise<object> {
    try {
      const existingCustomer = await this.sellerRepository.find({
        where: { sEmail: addSellerDto.email },
      });

      if (existingCustomer.length > 0) {
        throw new BadRequestException({
          message: 'This account is already taken',
          status: false,
        });
      }
      const seller = await this.globalService.addUser(addSellerDto, 'seller');
      await this.sellerRepository.save(seller);
      return {
        message: 'Added Successfully',
        status: true,
      };
    } catch (error) {
      console.log(`Failed to add Seller: ${error.message}`);
      throw new BadRequestException({
        message: 'Failed to add Seller',
        status: false,
      });
    }
  }

  async validateUSer(loginsellerDto: loginUserDto): Promise<Seller> {
    const user = await this.sellerRepository.findOne({
      where: { sEmail: loginsellerDto.email },
    });
    if (
      user &&
      (await this.globalService.compareHash(
        loginsellerDto.password,
        user.sPassword,
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

  async loginSeller(user): Promise<Object> {
    try {
      const payload = { sId: user.sId, roleId: user.roleId };
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
      const sId = decoded.sId;
      const role = decoded.roleId;
      return { sId: sId, role: role };
    } catch (error) {
      console.log('Invalid Token :', error.message);
      throw new UnauthorizedException({
        message: 'Token is not valid',
        satus: false,
      });
    }
  }

  async getSeller(user) {
    try {
      const seller = await this.sellerRepository.findOne({
        where: { sId: user.sId },
      });
      if (!seller) {
        throw new NotFoundException({
          message: 'seller not found',
          status: false,
        });
      }
      return seller;
    } catch (error) {
      console.log('Unable to fetch user:', error.message);
      throw new BadRequestException({
        message: 'Error in fetching user details',
        status: false,
      });
    }
  }

  async updatePassword(
    user: authSellerInterface,
    updateSellerPasswordDto: updateUserPasswordDto,
  ): Promise<object> {
    try {
      const data = await this.getSeller(user);
      if (!data) {
        throw new NotFoundException({
          message: 'Seller not found',
          status: false,
        });
      } else {
        const isMatch = await this.globalService.updatePassword(
          updateSellerPasswordDto,
          data.sPassword,
        );
        if (isMatch === false) {
          throw new UnauthorizedException({
            message: 'Old Password is Invalid',
            status: false,
          });
        } else {
          await this.sellerRepository.update(user.sId, {
            sPassword: isMatch,
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

  async deleteSeller(
    user: authSellerInterface,
    loginSellerDto: loginUserDto,
  ): Promise<object> {
    try {
      const data = await this.getSeller(user);
      if (!data) {
        throw new NotFoundException({
          message: 'Customer not found',
          status: false,
        });
      }
      const isMatch = await this.globalService.compareHash(
        loginSellerDto.password,
        data.sPassword,
      );

      if (!isMatch) {
        throw new UnauthorizedException({
          message: 'Password is Invalid',
          status: false,
        });
      }
      await this.sellerRepository.delete(data.sId);
      return { message: 'User deleted successfully', status: true };
    } catch (error) {
      console.log('Error in deleting user:', error.message);
      throw new BadRequestException({
        message: 'Error in deleting user',
        status: false,
      });
    }
  }

  async fetchAllSellers(): Promise<Seller[]> {
    try {
      return await this.sellerRepository.find();
    } catch (error) {
      console.log('Error in Fetching users:', error.message);
      throw new BadRequestException({
        message: 'Error in Fetching user',
        status: false,
      });
    }
  }

  async fetchSellerCount(){
    try {
      return await this.sellerRepository.count();
    } catch (error) {
      console.log('Error in Fetching seller count:', error.message);
      throw new BadRequestException({
        message: 'Error in Fetching seller count',
        status: false,
      });
    }
  }

  async addBike(user: authSellerInterface, addBikeDto: addBikeDto) {
    try {
      let data = {};
      data = { ...addBikeDto, sId: user.sId, createdTime: new Date() };
      const isAdded = await this.bikeService.addBike(data);
      // const isUpdated = await this.SellerPaymentService.addBikes(sId)
      if (isAdded) {
        return { message: 'Bike Added', status: true };
      } else {
        throw new BadRequestException({
          message: 'Unable to add the data',
          status: false,
        });
      }
    } catch (error) {
      console.log('Unable to Save Bike Data', error.message);
      throw new BadRequestException({
        message: 'Unable to add the data',
        status: false,
      });
    }
  }

  async getBike(user: authSellerInterface) {
    try {
      const data = await this.bikeService.getBike(user.sId);
      return data;
    } catch (error) {
      console.log('Unable to get Bike Data', error.message);
      throw new BadRequestException({
        message: 'Unable to get Bike the data',
        status: false,
      });
    }
  }

  async updateBike(user: authSellerInterface, updateBikeDto: updateBikeDto) {
    try {
      await this.bikeService.updateBike(user, updateBikeDto);
    } catch (error) {
      console.log('Unable to update Bike Data', error.message);
      throw new BadRequestException({
        message: 'Unable to update Bike the data',
        status: false,
      });
    }
  }

  async deleteBike(sId: string, bId: string) {
    try {
     return await this.bikeService.deleteBike(sId, bId);
    } catch (error) {
      console.log('Unable to delete Bike Data', error.message);
      throw new BadRequestException({
        message: 'Unable to delete Bike the data',
        status: false,
      });
    }
  }

  async getBikeTaken(sId:string){
    try {
     return await this.bikeService.getBikeTaken(sId)
    } catch (error) {
      console.log('Unable to get seller Bike Data', error.message);
      throw new BadRequestException({
        message: 'Unable to get seller Bike the data',
        status: false,
      });
    }
  }

  async FetchSellerDetailsRevenue(){
      try {
       return  await this.bikeService.FetchSellerDetailsRevenue()
      } catch (error) {
        console.log('Unable to get seller Bike Data', error.message);
      throw new BadRequestException({
        message: 'Unable to get seller revenue details',
        status: false,
      });
      }
  }
}
