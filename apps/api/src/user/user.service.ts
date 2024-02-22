import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}
  async findOne(id: number) {
    const userFound = await this.userRepository.findOne({ where: { id: id } });
    if (!userFound) throw new NotFoundException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = userFound;
    return user;
  }

  async findByEmail(email: string) {
    const userFound = await this.userRepository.findOne({ where: { email } });
    if (!userFound) throw new NotFoundException('User not found');

    return userFound;
  }

  async create(dto: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: { email: dto.email }
    });

    if (userFound) throw new BadRequestException('User already exists');

    const userCreated = this.userRepository.create(dto);
    await this.userRepository.save(userCreated);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = userCreated;
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }
}
