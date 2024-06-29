import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from './entity/bikes.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { updateBikeDto } from './dto/update-bike.dto';
import { authSellerInterface } from 'src/gloabl/interface/auth-seller.interface';

export enum ERole {
  seller = 'sel001',
  admin = 'adm001',
}

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike)
    private bikeRepository: Repository<Bike>,
  ) {}

  async addBike(data: object) {
    try {
      let bikeData = {};
      bikeData = { ...data, bId: uuidv4() };
      await this.bikeRepository.save(bikeData);
      return true;
    } catch (error) {
      console.log('Unable to Add Bike:', error.message);
      return false;
    }
  }

  async getBike(user: string): Promise<Bike[] | boolean> {
    try {
      const data = await this.bikeRepository.find({ where: { sId: user } });
      return data;
    } catch (error) {
      console.log('Unable to get Bike:', error.message);
      return false;
    }
  }
  async updateBike(user: authSellerInterface, bikeData: updateBikeDto):Promise<boolean> {
    try {
      const sId = user.sId;
      const bId = bikeData.bId;
      await this.bikeRepository.update({ sId, bId }, bikeData);
      return true;
    } catch (error) {
      console.log('Unable to update Bike:', error.message);
      return false;
    }
  }

  async deleteBike(sId: string, bId: string):Promise<boolean> {
    try {
      await this.bikeRepository.delete({ sId, bId });
      return true
    } catch (error) {
      console.log('Unable to update Bike:', error.message);
      return false;
    }
  }
}
