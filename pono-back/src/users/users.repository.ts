import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signupRepository(user) {
    const newUserser = await this.usersRepository.save(user);
    const secureUser = {
      ...newUserser,
      user_password: undefined,
      confirm_password: undefined,
    };
    return secureUser;
  }

  async findAllRepository() {
    const users = await this.usersRepository.find();
    const secureUsers = users.map((user) => ({ ...user, password: undefined }));
    return secureUsers;
  }

  async findOneRepository(id: string) {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) throw new BadRequestException('Usuario no encontrado');
    const secureUser = { ...user, password: undefined };
    return secureUser;
  }
  async findOneByEmailRepository(user_email: string) {
    const user = await this.usersRepository.findOne({ where: { user_email } });
    return user;
  }

  async updateUserRepository(user, updateUserDto) {
    await this.usersRepository.update(user.user_id, updateUserDto);
    const findUser = await this.findOneRepository(user.user_id);
    return findUser;
  }
}
