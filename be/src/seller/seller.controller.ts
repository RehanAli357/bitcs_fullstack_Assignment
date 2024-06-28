import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
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
      throw new BadRequestException({
        message: 'Error in deleting user ',
        status: false,
      });
    }
  }
}
