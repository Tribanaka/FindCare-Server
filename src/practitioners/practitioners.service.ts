import { FindPractitionersDto } from './dto/find-practitioners.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Practitioner } from './practitioner.entity';
import { Repository } from 'typeorm';
import { CreatePractionerDto } from './dto/create-practitioner.dto';
import { hashSync } from 'bcrypt';
import { HospitalsService } from 'src/hospitals/hospitals.service';

import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { bufferToStream } from 'src/utils/bufferToStrem';
import paginate from 'src/pagination';

@Injectable()
export class PractitionersService {
  constructor(
    @InjectRepository(Practitioner)
    private practitionerRepository: Repository<Practitioner>,
    private hospitalsService: HospitalsService,
  ) {}

  findAll(findPractitionersDto: FindPractitionersDto) {
    const { hospitalName, city, search, state, specialization, skip, ...rest } =
      findPractitionersDto;
    const paginateOptionsDto = { ...rest, skip };
    const query = this.practitionerRepository
      .createQueryBuilder('practitioner')
      .leftJoinAndSelect('practitioner.hospital', 'hospital');

    if (search) {
      query
        .orWhere('LOWER(practitioner.specialization) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(hospital.name) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(hospital.address) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(hospital.city) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(hospital.state) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(practitioner.first_name) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(practitioner.last_name) LIKE LOWER(:search)', {
          search: `%${search}%`,
        });
    }
    if (specialization) {
      query.andWhere(
        'LOWER(practitioner.specialization) LIKE LOWER(:specialization)',
        { specialization: `%${specialization}%` },
      );
    }

    if (hospitalName) {
      query.andWhere('LOWER(hospital.name) LIKE LOWER(:hospitalName)', {
        hospitalName: `%${hospitalName}%`,
      });
    }

    if (city) {
      query.andWhere('LOWER(hospital.city) LIKE LOWER(:city)', {
        city: `%${city}%`,
      });
    }

    if (state) {
      query.andWhere('LOWER(hospital.state) LIKE LOWER(:state)', {
        state: `%${state}%`,
      });
    }

    return paginate(query, 'practitioner.id', paginateOptionsDto);
  }

  findByEmail(email: string): Promise<Practitioner | null> {
    return this.practitionerRepository.findOne({
      select: ['id', 'email', 'first_name', 'last_name', 'password'],
      where: { email },
    });
  }

  findById(id: number): Promise<Practitioner> {
    return this.practitionerRepository.findOneBy({ id });
  }

  async create(
    createPractionerDto: CreatePractionerDto,
    photo: Express.Multer.File,
  ) {
    const saltRounds = 10;
    const { firstName, lastName, email, bio, specialization, hospitalId } =
      createPractionerDto;

    const existingPractitioner = await this.practitionerRepository.findOneBy({
      email,
    });

    if (existingPractitioner)
      throw new HttpException(
        'This email has been used',
        HttpStatus.BAD_REQUEST,
      );

    const hospital = await this.hospitalsService.findOne(+hospitalId);

    if (!hospital) {
      throw new HttpException(
        `Hospital with #${hospitalId} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    cloudinary.config({
      cloud_name: 'dpfycjmuw',
      api_key: `${process.env.CLOUDINARY_KEY}`,
      api_secret: `${process.env.CLOUDINARY_SECRET}`,
    });

    const imageResonse = await this.uploadImage(photo);

    if (!imageResonse.secure_url) {
      throw new HttpException(
        'Failed to upload Image',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const hashedPassword = hashSync(createPractionerDto.password, saltRounds);

    const practitoner = this.practitionerRepository.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      bio: bio,
      specialization: specialization,
      hospital: hospital,
      photoUrl: imageResonse.secure_url,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } =
      await this.practitionerRepository.save(practitoner);

    return result;
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      bufferToStream(file.buffer).pipe(upload);
    });
  }
}
