import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Practitioner } from './practitioner.entity';
import { Repository } from 'typeorm';
import { CreatePractionerDto } from './dto/create-practitioner.dto';
import { hashSync } from 'bcrypt';
import { SchedulesService } from 'src/schedules/schedules.service';

@Injectable()
export class PractitionersService {
  constructor(
    @InjectRepository(Practitioner)
    private practitionerRepository: Repository<Practitioner>,
  ) {}

  findAll() {
    return this.practitionerRepository.find();
  }

  findByEmail(email: string): Promise<Practitioner | null> {
    return this.practitionerRepository.findOneBy({ email });
  }

  findById(id: number): Promise<Practitioner> {
    return this.practitionerRepository.findOneBy({ id });
  }

  async create(CreatePractionerDto: CreatePractionerDto) {
    const saltRounds = 10;
    const { firstName, lastName, email, bio, specialization } =
      CreatePractionerDto;

    const existingPractitioner = await this.practitionerRepository.findOneBy({
      email,
    });

    if (existingPractitioner)
      throw new HttpException(
        'This email has been used',
        HttpStatus.BAD_REQUEST,
      );

    const hashedPassword = hashSync(CreatePractionerDto.password, saltRounds);

    const practitoner = this.practitionerRepository.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      bio: bio,
      specialization: specialization,
    });

    const { password, ...result } =
      await this.practitionerRepository.save(practitoner);

    return result;
  }
}
