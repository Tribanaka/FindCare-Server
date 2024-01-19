import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashSync } from 'bcrypt';
import {
  PaginationDto,
  PaginationMetaDto,
  PaginationOptionsDto,
} from 'src/pagination/dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(
    paginationOptionsDto: PaginationOptionsDto,
  ): Promise<PaginationDto<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder
      .orderBy('user.created_at', paginationOptionsDto.order)
      .skip(paginationOptionsDto.skip)
      .take(paginationOptionsDto.limit);
    const totalItemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const paginationMetaDto = new PaginationMetaDto({
      itemCount: entities.length,
      pageOptionsDto: paginationOptionsDto,
      totalItemCount,
    });
    return new PaginationDto(entities, paginationMetaDto);
    // return this.usersRepository.find();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      select: ['id', 'email', 'first_name', 'last_name', 'password'],
      where: { email },
    });
  }
  findByEmailWithoutPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto) {
    const saltRounds = 10;
    const { firstName, lastName, email } = createUserDto;

    const existingUser = await this.findByEmailWithoutPassword(email);

    if (existingUser) {
      throw new HttpException(
        'This email has been used',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = hashSync(createUserDto.password, saltRounds);

    const user = this.usersRepository.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.usersRepository.save(user);

    return result;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
