import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateNotEmptyBodyPipe implements PipeTransform {
  transform(value: any) {
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException(
        'El cuerpo de la solicitud no puede estar vacío.',
      );
    }
    return value;
  }
}
