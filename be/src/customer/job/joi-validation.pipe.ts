import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.Schema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // console.log("====",value,metadata)
    const { error } = this.schema.validate(value);
    if (error) {
      // console.log(error)
      throw new BadRequestException(error.details[0].message);
    }
    return value;
  }
}
