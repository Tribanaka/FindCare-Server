import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PractitionersService } from 'src/practitioners/practitioners.service';
import { UsersService } from 'src/users/users.service';
import getDayOfWeek from 'src/utils/getDayOfWeek';
import { SchedulesService } from 'src/schedules/schedules.service';
import addMinutes from 'src/utils/addMinutes';
import { format, parse } from 'date-fns';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private practitionersService: PractitionersService,
    private usersService: UsersService,
    private schedulesService: SchedulesService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { practitionerId, userId, date, time } = createAppointmentDto;

    const dayOfWeek = getDayOfWeek(date);

    const practitioner =
      await this.practitionersService.findById(practitionerId);

    const patient = await this.usersService.findById(userId);

    if (!practitioner || !patient) {
      throw new NotFoundException();
    }

    const schedule = await this.schedulesService.findOne(
      practitioner,
      dayOfWeek,
    );

    console.log({ schedule });
    console.log({ time });

    const selectedTime = parse(
      `${date} ${time}`,
      'dd/MM/yyyy HH:mm',
      new Date(),
    );
    // const today = format(new Date(), 'dd/MM/yyyy');
    const currentOpeningTime = parse(
      `${date} ${schedule?.opening_hour}`,
      'dd/MM/yyyy HH:mm:ss',
      new Date(),
    );
    const currentClosingTime = parse(
      `${date} ${schedule?.closing_hour}`,
      'dd/MM/yyyy HH:mm:ss',
      new Date(),
    );

    console.log(
      selectedTime,
      currentOpeningTime,
      currentClosingTime,
      addMinutes(date, 30),
    );

    if (
      !schedule ||
      selectedTime < currentOpeningTime ||
      selectedTime > currentClosingTime
    ) {
      throw new HttpException(
        'Doctor not available at the selected date and time.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingAppointment = await this.appointmentsRepository.findOne({
      where: { practitioner, startTime: selectedTime },
    });

    if (existingAppointment) {
      throw new HttpException(
        'An appointment already exists at the selected time.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // const newAppointment = this.appointmentsRepository.create({
    //   practitioner,
    //   user: patient,
    //   startTime: selectedTime,
    //   endTime: addMinutes(date, 30),
    // });
  }
}
