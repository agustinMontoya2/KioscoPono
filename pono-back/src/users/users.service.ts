import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  async signupService(createUserDto: CreateUserDto) {
    const {
      user_name,
      user_email,
      user_phone,
      user_password,
      confirm_password,
    } = createUserDto;
    const user = await this.findOneByEmail(user_email);
    console.log(user);
    if (user) throw new BadRequestException('El email ya esta registrado');
    const hashedPassword = await bcrypt.hash(user_password, 10);
    if (!hashedPassword)
      throw new BadRequestException('Error al crear contraseña');
    return this.usersRepository.signupRepository({
      user_name,
      user_email,
      user_phone,
      user_password: hashedPassword,
      confirm_password,
      user_provider: 'local',
    });
  }

  async loginService(loginUserDto: LoginUserDto) {
    const { user_email, user_password } = loginUserDto;

    const user = await this.findOneByEmail(user_email);
    if (!user) throw new BadRequestException('Los campos no son correctos');

    const validPassword = await bcrypt.compare(
      user_password,
      user.user_password,
    );
    if (!validPassword)
      throw new BadRequestException('Los campos no son correctos');

    const userPayload = {
      user_id: user.user_id,
      email: user.user_email,
      role: user.user_is_admin ? Role.Admin : Role.User,
    };
    const token = this.jwtService.sign(userPayload);
    return { success: true, token: token };
  }

  findAll() {
    return this.usersRepository.findAllRepository();
  }

  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException('El id no es valido');
    const user = await this.usersRepository.findOneRepository(id);

    return user;
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneByEmailRepository(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isUUID(id)) throw new BadRequestException('El id no es valido');
    const { user_name, user_email, user_phone } = updateUserDto;
    const user = await this.findOne(id);

    if (user_email) {
      const emailUser = await this.findOneByEmail(user_email);
      if (emailUser)
        throw new BadRequestException('El email ya esta registrado');
    }
    return this.usersRepository.updateUserRepository(user, {
      user_name,
      user_email,
      user_phone,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
