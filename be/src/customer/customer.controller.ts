import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
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
import { bookBike } from 'src/bike/dto/book-bike.dto';
import { bookBikeSchema } from 'src/bike/job/book-bike.job';
import { updateBikeSchema } from 'src/bike/job/update-bike.job';
import { updateBikeDto } from 'src/bike/dto/update-bike.dto';
import { deleteBikeDto } from 'src/bike/dto/delete-bike.dto';
import { deleteBikeSchema } from 'src/bike/job/delete-bike.job';
import { retry } from 'rxjs';
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

  @Get('/get-Bikes')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.customer)
  async getAllBike() {
    try {
      return this.customerService.getAllBike();
    } catch (error) {
      throw new BadRequestException({
        message: 'Error in fetching bikes data ',
        status: false,
      });
    }
  }


  @Get('/get-bike/:id')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.customer,ERole.seller,ERole.admin)
  async getBike(@Param('id') id: string) {
    try {
      const bikeIdDto = new deleteBikeDto();
      bikeIdDto.bId = id;
      
      return await this.customerService.getBike(bikeIdDto)
    } catch (error) {
      console.error('Error fetching bike data:', error.message);
      throw new NotFoundException('Error occurred while retrieving bike data');
    }
  }

  @Put('/rent-bike')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.customer)
  async bookBike(
    @AuthUser() user: authUserInterface,
    @Body(new JoiValidationPipe(bookBikeSchema)) bikeIdDto: bookBike,
  ) {
    try {
      const result = await this.customerService.bookBike(user, bikeIdDto);

      if (!result) {
        throw new BadRequestException({
          message: 'Error in booking bike',
          status: false,
        });
      }

      return { message: 'Your ride is booked successfully', status: true };
    } catch (error) {
      throw new BadRequestException({
        message: 'Error in booking bike',
        status: false,
      });
    }
  }

  @Put('/return-bike')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.customer)
  async returnBike(
    @AuthUser() user: authUserInterface,
    @Body(new JoiValidationPipe(deleteBikeSchema)) bikeIdDto: deleteBikeDto,
  ) {
    try {
      await this.customerService.returnBike(user, bikeIdDto);
      return { message: 'Successfully Returned', status: true };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException({
        message: 'Error in Returning bike',
        status: false,
      });
    }
  }

  @Get('/booked-bike')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.customer)
  async getBookedBike(@AuthUser() user:authUserInterface){
    try {
      return this.customerService.getBookedBike(user.cId)
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException({
        message: 'Error in getting booked bike data',
        status: false,
      });
    }
  }

  @Get('/fetch-payment')
  @UseGuards(AuthGuard)
  @roleGaurd(ERole.customer)
  async fetchPayment(@AuthUser() user:authUserInterface){
    try {
      return this.customerService.fetchPayment(user.cId)
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException({
        message: 'Error in fetching payment history',
        status: false,
      });
    }
  }
}
