import { PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { Match } from '../../custom-validators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(3, 20, { message: 'El nombre debe tener entre 3 y 20 caracteres' })
  user_name: string;

  @IsNotEmpty({ message: 'El email no puede estar vacio' })
  @IsEmail({}, { message: 'El email no es valido' })
  user_email: string;

  @IsNotEmpty({ message: 'El telefono no puede estar vacio' })
  @IsString({ message: 'El telefono debe ser un texto' })
  user_phone: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula, un numero y un simbolo',
    },
  )
  user_password: string;

  @Match('user_password')
  confirm_password: number;

  @IsEmpty()
  user_is_admin: boolean;
}

export class LoginUserDto extends PickType(CreateUserDto, [
  'user_email',
  'user_password',
]) {}
