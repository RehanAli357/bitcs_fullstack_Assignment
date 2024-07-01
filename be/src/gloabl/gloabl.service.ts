import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { addUserDto } from './globalDto/add-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { updateUserPasswordDto } from './globalDto/update-user.dto';

@Injectable()
export class GloablService {
  async createHash(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  
  async compareHash(password, hashPassword): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashPassword);
    if (isMatch) {
      return true;
    } else {
      return false;
    }
  }

  async addUser(user: addUserDto, type:string): Promise<object> {
    const hashPassword = await this.createHash(user.password);
    if (type === 'customer') {
      const customer = {
        cId: uuidv4(),
        cName: user.name,
        cEmail: user.email,
        cPassword: hashPassword,
        roleId: process.env.CUSTOMER_ROLE,
        createdTime: new Date(),
      };
      return customer;
    } else if (type === 'seller') {
      const seller = {
        sId: uuidv4(),
        sName: user.name,
        sEmail: user.email,
        sPassword: hashPassword,
        roleId: process.env.SELLER_ROLE,
        createdTime: new Date(),
      };
      return seller;
    } else if(type === 'admin'){
      const admin = {
        aId: uuidv4(),
        aName: user.name,
        aEmail: user.email,
        aPassword: hashPassword,
        roleId: process.env.ADMIN_ROLE,
        createdTime: new Date(),
      };
      return admin;
    }
  }

  async updatePassword (passowrd:updateUserPasswordDto,passwordHash:string){ 
    const isMatch =await this.compareHash(passowrd.oldPassword,passwordHash)
    if(isMatch){  
      const hashPassword =  await this.createHash(passowrd.newPassword)
      return hashPassword
    }else{
      return false
    }
  }
}
