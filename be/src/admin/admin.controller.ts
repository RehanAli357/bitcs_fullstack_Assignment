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
import { AdminService, ERole } from './admin.service';
import { JoiValidationPipe } from 'src/gloabl/globalJob/joi-validation.pipe';
import { addUserSchema } from 'src/gloabl/globalJob/add-user.job';
import { addUserDto } from 'src/gloabl/globalDto/add-user.dto';
import { loginUserSchema } from 'src/gloabl/globalJob/login-user.job';
import { loginUserDto } from 'src/gloabl/globalDto/login-user.dto';
import { roleGaurd } from './gaurds/roles.decorator';
import { AuthUser } from './gaurds/auth.decorator';
import { authAdminInterface } from 'src/gloabl/interface/auth-admin.interface';
import { Admin } from './entity/amin.entity';
import { AuthGuard } from './gaurds/auth.gaurd';
import { updateUserSchema } from 'src/gloabl/globalJob/update-user.job';
import { updateUserPasswordDto } from 'src/gloabl/globalDto/update-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/add-admin')
  @UsePipes(new JoiValidationPipe(addUserSchema))
  async addAdmin(@Body() addAdminDto: addUserDto) {
    try {
      return await this.adminService.addAdmin(addAdminDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async loginAdmin(@Body() loginAdminDto: loginUserDto) {
    const user = await this.adminService.validateUSer(loginAdminDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.adminService.loginAdmin(user);
    return token;
  }

  @Get()
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.admin)
  async getSeller(@AuthUser() user: authAdminInterface): Promise<Admin> {
    try {
      const data = await this.adminService.getAdmin(user);
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
  @roleGaurd(ERole.admin)
  async updatePassword(
    @AuthUser() user: authAdminInterface,
    @Body(new JoiValidationPipe(updateUserSchema))
    updateAdminPasswordDto: updateUserPasswordDto,
  ): Promise<object> {
    try {
      const data = await this.adminService.updatePassword(
        user,
        updateAdminPasswordDto,
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
  @roleGaurd(ERole.admin)
  async deleteAdmin(
    @AuthUser() user: authAdminInterface,
    @Body(new JoiValidationPipe(loginUserSchema))
    loginCustomerDto: loginUserDto,
  ) {
    try {
      return await this.adminService.deleteAdmin(user, loginCustomerDto);
    } catch (error) {
      throw new BadRequestException({
        message: 'Error in deleting user ',
        status: false,
      });
    }
  }

  @Get('/fetch-customer')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.admin)
  async fetchAllCustomer() {
    try {
      return await this.adminService.fetchAllCustomer();
    } catch (error) {
      throw new BadRequestException({
        message: 'Error in fetching user ',
        status: false,
      });
    }
  }

  @Get('/fetch-seller')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.admin)
  async fetchAllSeller(){
    try {
      return await this.adminService.fetchAllSeller();
    } catch (error) {
      throw new BadRequestException({
        message: 'Error in fetching user ',
        status: false,
      });
    }
  }

  @Get('/fetch-bike')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.admin)
  async fetchAllBikes(){
    try {
      return this.adminService.fetchAllBikes()
    } catch (error) {
      throw new BadRequestException({
        message: 'Error in fetching bikes data ',
        status: false,
      });
    }
  }
}
