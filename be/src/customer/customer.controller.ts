import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CustomerService, ERole } from './customer.service';
import { JoiValidationPipe } from 'src/gloabl/globalJob/joi-validation.pipe';
import { addUserSchema } from 'src/gloabl/globalJob/add-user.job';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { loginUserSchema } from 'src/gloabl/globalJob/login-user.job';
import { AuthGuard } from './gaurds/auth.gaurd';
import { Customer } from './entity/customers.entity';
import { AuthUser } from './gaurds/auth.decorator';
import { authUserInterface } from '../gloabl/interface/auth-user.interface';
import { roleGaurd } from './gaurds/roles.decorator';
import { updateUserSchema } from 'src/gloabl/globalJob/update-user.job';
import { addUserDto } from 'src/gloabl/globalDto/add-user.dto';
import { loginUserDto } from 'src/gloabl/globalDto/login-user.dto';
import { updateUserPasswordDto } from 'src/gloabl/globalDto/update-user.dto';
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/add-customer')
  @UsePipes(new JoiValidationPipe(addUserSchema))
  async addCustomer(@Body() addCustomerDto: addUserDto) {
    try {
      return await this.customerService.addCustomer(addCustomerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async loginCustomer(@Body() loginCustomerDto: loginUserDto) {
    const user = await this.customerService.validateUSer(loginCustomerDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.customerService.loginCustomer(user);
    return token;
  }

  @Get()
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.customer, ERole.admin)
  async getCustomer(@AuthUser() user: authUserInterface): Promise<Customer> {
    try {
      const data = await this.customerService.getCustomer(user);
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
  @roleGaurd(ERole.customer, ERole.admin)
  async updatePassword(
    @AuthUser() user: authUserInterface,
    @Body(new JoiValidationPipe(updateUserSchema))
    updateCustomerPasswordDto: updateUserPasswordDto,
  ): Promise<object> {
    try {
      const data = await this.customerService.updatePassword(
        user,
        updateCustomerPasswordDto,
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
  @roleGaurd(ERole.customer, ERole.admin)
  async deleteCustomer(
    @AuthUser() user: authUserInterface,
    @Body(new JoiValidationPipe(loginUserSchema))
    loginCustomerDto: loginUserDto,
  ) {
    try {
      return await this.customerService.deleteCustomer(user, loginCustomerDto);
    } catch (error) {
      throw new BadRequestException({
        message: 'Error in deleting user ',
        status: false,
      });
    }
  }
}
