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

@Injectable()
export class PractitionersService {
  constructor(
    @InjectRepository(Practitioner)
    private practitionerRepository: Repository<Practitioner>,
    private hospitalsService: HospitalsService,
  ) {}

  findAll(filter: { hospitalName?: string; state?: string; city?: string }) {
    const query = this.practitionerRepository
      .createQueryBuilder('practitioner')
      .leftJoinAndSelect('practitioner.hospital', 'hospital');

    if (filter.hospitalName) {
      query.andWhere('hospital.name = :hospitalName', {
        hospitalName: filter.hospitalName,
      });
    }

    if (filter.state) {
      query.andWhere('hospital.state = :state', { state: filter.state });
    }

    if (filter.city) {
      query.andWhere('hospital.city = :city', { city: filter.city });
    }

    return query.getMany();
  }

  findByEmail(email: string): Promise<Practitioner | null> {
    return this.practitionerRepository.findOneBy({ email });
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
