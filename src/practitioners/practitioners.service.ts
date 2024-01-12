import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Practitioner } from './practitioner.entity';
import { Repository } from 'typeorm';
import { CreatePractionerDto } from './dto/create-practiitoner.dto';
import { hashSync } from 'bcrypt';

@Injectable()
export class PractitionersService {
  constructor(
    @InjectRepository(Practitioner)
    private practitionerRepository: Repository<Practitioner>,
  ) {}

  findAll() {
    return this.practitionerRepository.find();
  }

  findOne(email: string): Promise<Practitioner | null> {
    return this.practitionerRepository.findOneBy({ email });
  }

  async create(CreatePractionerDto: CreatePractionerDto) {
    const saltRounds = 10;
    const { firstName, lastName, email, password, bio, specialization } =
      CreatePractionerDto;

    const hashedPassword = hashSync(password, saltRounds);

    const practitoner = this.practitionerRepository.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      bio: bio,
      specialization: specialization,
    });

    return this.practitionerRepository.save(practitoner);
  }
}
