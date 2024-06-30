import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as env from 'dotenv';
import * as path from 'path';

env.config({
  path:path.resolve(__dirname,'../.env')
})  
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(5000);
}
bootstrap();
