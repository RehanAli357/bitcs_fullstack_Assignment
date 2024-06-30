import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from './entity/bikes.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { updateBikeDto } from './dto/update-bike.dto';
import { authSellerInterface } from 'src/gloabl/interface/auth-seller.interface';
import { authUserInterface } from 'src/gloabl/interface/auth-user.interface';
import { deleteBikeDto } from './dto/delete-bike.dto';
import { bookBike } from './dto/book-bike.dto';
import { BikeTaken } from './entity/bikeTaken.entity';
import { CustomerPaymentService } from 'src/customer/customerPayment.service';

export enum ERole {
  seller = 'sel001',
  admin = 'adm001',
}

interface bikeData {
  bId: string;
  bName: string;
  bType: string;
  bPrice: number;
  bDistance: number;
  available: boolean;
  bImage: string | null;
  sId: string;
  createdTime: Date;
}

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike)
    private bikeRepository: Repository<Bike>,
    @InjectRepository(BikeTaken)
    private bikeTakenRepository: Repository<BikeTaken>,

    @Inject(forwardRef(() => CustomerPaymentService))
    private customerPaymentService: CustomerPaymentService,
  ) {}

  async addBike(data: object) {
    try {
      let bikeData = {};
      const bId = uuidv4();
      bikeData = { ...data, bId: bId };
      await this.bikeRepository.save(bikeData).then((data) => {
        this.addBikeTaken(bId, data.sId, data.createdTime);
      });
      return true;
    } catch (error) {
      console.log('Unable to Add Bike:', error.message);
      return false;
    }
  }

  async addBikeTaken(bId: string, sId: string, createdTime: Date) {
    try {
      let bikeTakenData = {};
      bikeTakenData = {
        bId: bId,
        btId: uuidv4(),
        sId: sId,
        bIncome: 0,
        bTime: 0,
        createdTime: createdTime,
      };
      await this.bikeTakenRepository.save(bikeTakenData);
      return true;
    } catch (error) {
      console.log('Unable to get Bike:', error.message);
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
  async updateBike(
    user: authSellerInterface,
    bikeData: updateBikeDto,
  ): Promise<boolean> {
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

  async updateBikeAvaible(
    user: authUserInterface,
    data: Bike,
    bikeDto: bookBike,
  ): Promise<boolean> {
    try {
      await this.bikeRepository.update(data.bId, {
        available: false,
      });
      console.log('Bike availability updated');
  
      const bikeTakenData = await this.bikeTakenRepository.findOne({
        where: { bId: data.bId },
      });
  
      if (!bikeTakenData) {
        console.log('No bike taken data found for bike ID:', data.bId);
        return false;
      }

      bikeTakenData.bIncome += data.bPrice * bikeDto.bTime;
      bikeTakenData.bTime += bikeDto.bTime;
  
      data.cId = user.cId;
      await this.bikeRepository.save(data);
      console.log('Bike data updated');
  
      await this.bikeTakenRepository.save(bikeTakenData);
      console.log('Bike taken data updated');
  
      await this.customerPaymentService.addPayment(
        user.cId,
        bikeDto.bId,
        data.bPrice * bikeDto.bTime,
        bikeDto.bTime
      );
      console.log('Payment added');
  
      return true;
    } catch (error) {
      console.log('Unable to update BikeTaken data:', error.message);
      return false;
    }
  }
  
  async deleteBike(sId: string, bId: string): Promise<boolean> {
    try {
      await this.bikeRepository.delete({ sId, bId });
      return true;
    } catch (error) {
      console.log('Unable to update Bike:', error.message);
      return false;
    }
  }

  async getAllBike() {
    try {
      return await this.bikeRepository.find();
    } catch (error) {
      console.log('Unable to get all Bikes data:', error.message);
      return false;
    }
  }

  async getBikeData(bikeIdDto: deleteBikeDto) {
    try {
      const bike = await this.bikeRepository.findOne({
        where: { bId: bikeIdDto.bId },
      });

      if (!bike) {
        throw new NotFoundException({
          message: 'No bike data found with the given ID',
          status: false,
        });
      }

      return bike;
    } catch (error) {
      console.log('Unable to get bike data:', error.message);
      throw new NotFoundException({
        message: 'Error occurred while retrieving bike data',
        status: false,
      });
    }
  }
  async bookBike(user: authUserInterface, bikeDto: bookBike) {
    const bId = bikeDto.bId;
    let data = await this.getBikeData({ bId });
    if (data !== null && data instanceof Bike && data.available === true) {
      await this.updateBikeAvaible(user, data, bikeDto);
      return true;
    } else {
      return false;
    }
  }

  async returnBike(cId:string,bId:string) {
    try {
      await this.bikeRepository.update(bId, {
        available: true,
        cId:''
      });
      return true
    } catch (error) {
      console.log('Unable to get bike data:', error.message);
      return false      
    }
  }
}
