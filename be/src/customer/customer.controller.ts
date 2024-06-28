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
import { JoiValidationPipe } from './job/joi-validation.pipe';
import { addCustomerSchema } from './job/add-customer.job';
import { addCustomerDto } from './dto/add-customer.dto';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { loginCustomerSchema } from './job/login-customer.job';
import { loginCustomerDto } from './dto/login-customer.dto';
import { AuthGuard } from './gaurds/auth.gaurd';
import { Customer } from './entity/customers.entity';
import { AuthUser } from './gaurds/auth.decorator';
import { authUserInterface } from './interface/auth-user.interface';
import { roleGaurd } from './gaurds/roles.decorator';
import { updateCustomerSchema } from './job/update-customer.job';
import { updateCustomerPasswordDto } from './dto/update-customer.dto';
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/add-customer')
  @UsePipes(new JoiValidationPipe(addCustomerSchema))
  async addCustomer(@Body() addCustomerDto: addCustomerDto) {
    try {
      return await this.customerService.addCustomer(addCustomerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginCustomerSchema))
  async loginCustomer(@Body() loginCustomerDto: loginCustomerDto) {
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
    @Body(new JoiValidationPipe(updateCustomerSchema))
    updateCustomerPasswordDto: updateCustomerPasswordDto,
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
    @Body(new JoiValidationPipe(loginCustomerSchema))
    loginCustomerDto: loginCustomerDto,
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
