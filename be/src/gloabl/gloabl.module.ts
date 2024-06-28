import { Module } from '@nestjs/common';
import { GloablService } from './gloabl.service';

@Module({
  providers: [GloablService],
  exports:[GloablService]
})
export class GloablModule {}
