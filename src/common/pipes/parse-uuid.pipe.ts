import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class ParseUUIDPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (validate(value)) return value;
    throw new BadRequestException(`"${value} is not a valid UUID string`);
  }
}
