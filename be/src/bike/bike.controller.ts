import { Controller, Post, UseGuards } from '@nestjs/common';
import { BikeService, ERole } from './bike.service';

@Controller('bike')
export class BikeController {
  constructor(private bikeService: BikeService) {}
}
