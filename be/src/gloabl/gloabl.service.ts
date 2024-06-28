import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GloablService {
    async createHash(password:string):Promise<string>{
        const saltOrRounds = 10;
        const hash =  await bcrypt.hash(password,saltOrRounds)
        return hash
    }

    async compareHash(password,hashPassword):Promise<boolean>{
        const isMatch = await bcrypt.compare(password,hashPassword)
        if(isMatch){
            return true
        }else{
            return false;
        }
    }
}
