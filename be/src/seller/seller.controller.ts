import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { addUserDto } from 'src/gloabl/globalDto/add-user.dto';
import { addUserSchema } from 'src/gloabl/globalJob/add-user.job';
import { JoiValidationPipe } from 'src/gloabl/globalJob/joi-validation.pipe';
import { ERole, SellerService } from './seller.service';
import { loginUserSchema } from 'src/gloabl/globalJob/login-user.job';
import { loginUserDto } from 'src/gloabl/globalDto/login-user.dto';
import { AuthGuard } from './gaurds/auth.gaurd';
import { roleGaurd } from './gaurds/roles.decorator';
import { AuthUser } from './gaurds/auth.decorator';
import { Seller } from './entity/sellers.entity';
import { updateUserSchema } from 'src/gloabl/globalJob/update-user.job';
import { updateUserPasswordDto } from 'src/gloabl/globalDto/update-user.dto';
import { authSellerInterface } from 'src/gloabl/interface/auth-seller.interface';
import { addBikeSchema } from 'src/bike/job/add-bike.job';
import { addBikeDto } from 'src/bike/dto/add-bike.dto';
import { updateBikeSchema } from 'src/bike/job/update-bike.job';
import { updateBikeDto } from 'src/bike/dto/update-bike.dto';
import { deleteBikeSchema } from 'src/bike/job/delete-bike.job';
import { deleteBikeDto } from 'src/bike/dto/delete-bike.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('/add-seller')
  @UsePipes(new JoiValidationPipe(addUserSchema))
  async addSeller(@Body() addSellerDto: addUserDto) {
    try {
      return await this.sellerService.addSeller(addSellerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async loginSeller(@Body() loginSellerDto: loginUserDto) {
    const user = await this.sellerService.validateUSer(loginSellerDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.sellerService.loginSeller(user);
    return token;
  }

  @Get()
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.seller, ERole.admin)
  async getSeller(@AuthUser() user: authSellerInterface): Promise<Seller> {
    try {
      const data = await this.sellerService.getSeller(user);
      return data;
    } catch (error) {
      console.log('Unable to get user data:', error.message);
      throw new BadRequestException({
        message: 'Error in fetching user Details',
        status: false,
      });
    }
  }

  @Put()
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.seller, ERole.admin)
  async updatePassword(
    @AuthUser() user: authSellerInterface,
    @Body(new JoiValidationPipe(updateUserSchema))
    updateSellerPasswordDto: updateUserPasswordDto,
  ): Promise<object> {
    try {
      const data = await this.sellerService.updatePassword(
        user,
        updateSellerPasswordDto,
      );
      return data;
    } catch (error) {
      console.log('Unable to update password:', error.message);
      throw new BadRequestException({
        message: 'Error in updating passowrd',
        status: false,
      });
    }
  }

  @Delete()
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.seller, ERole.admin)
  async deleteSeller(
    @AuthUser() user: authSellerInterface,
    @Body(new JoiValidationPipe(loginUserSchema))
    loginCustomerDto: loginUserDto,
  ) {
    try {
      return await this.sellerService.deleteSeller(user, loginCustomerDto);
    } catch (error) {
      console.log('Unable to delet user:', error.message);
      throw new BadRequestException({
        message: 'Error in deleting user ',
        status: false,
      });
    }
  }

  @Post('/add-bike')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.seller)
  async addBike(
    @AuthUser() user: authSellerInterface,
    @Body(new JoiValidationPipe(addBikeSchema)) addBikeDto: addBikeDto,
  ): Promise<any> {
    try {
      return this.sellerService.addBike(user, addBikeDto);
    } catch (error) {
      console.log('Unable to add Bike data:', error.message);
      throw new BadRequestException({
        message: 'Unable to add Bike ',
        status: false,
      });
    }
  }

  @Get('/get-bike')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.seller)
  async getBike(@AuthUser() user: authSellerInterface) {
    try {
      return this.sellerService.getBike(user);
    } catch (error) {
      console.log('Unable to get Bike data:', error.message);
      throw new BadRequestException({
        message: 'Unable to add Bike ',
        status: false,
      });
    }
  }

  @Put('/update-bike')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.seller)
  async updateBike(
    @AuthUser() user: authSellerInterface,
    @Body(new JoiValidationPipe(updateBikeSchema)) updateBikeDto: updateBikeDto,
  ) {
    try {
      this.sellerService.updateBike(user, updateBikeDto);
      return { message: 'Updated Successfully', status: true };
    } catch (error) {
      console.log('Unable to update Bike data:', error.message);
      throw new BadRequestException({
        message: 'Unable to update Bike ',
        status: false,
      });
    }
  }

  @Delete('/delete-bike')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.seller)
  async deleteBike(
    @AuthUser() user: authSellerInterface,
    @Body(new JoiValidationPipe(deleteBikeSchema)) deleteBikeDto: deleteBikeDto,
  ) {
    try {
      this.sellerService.deleteBike(user.sId,deleteBikeDto.bId);
      return { message: 'Deleted Successfully', status: true };
    } catch (error) {
      console.log('Unable to delete Bike data:', error.message);
      throw new BadRequestException({
        message: 'Unable to delete Bike ',
        status: false,
      });
    }
  }
}
