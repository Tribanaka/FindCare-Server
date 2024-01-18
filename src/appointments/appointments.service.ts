import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
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
import moment from 'moment-timezone';
import { Practitioner } from 'src/practitioners/practitioner.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private practitionersService: PractitionersService,
    private usersService: UsersService,
    @Inject(forwardRef(() => SchedulesService))
    private schedulesService: SchedulesService,
  ) {}

  findOne(practitioner: Practitioner, date: string, time: string) {
    return this.appointmentsRepository.findOneBy({ practitioner, date, time });
  }

  // async create(createAppointmentDto: CreateAppointmentDto) {
  //   const { practitionerId, userId, date, time } = createAppointmentDto;

  //   const dayOfWeek = getDayOfWeek(date);

  //   const practitioner =
  //     await this.practitionersService.findById(practitionerId);

  //   const patient = await this.usersService.findById(userId);

  //   if (!practitioner || !patient) {
  //     throw new NotFoundException();
  //   }

  //   const schedule = await this.schedulesService.findOne(
  //     practitioner,
  //     dayOfWeek,
  //   );

  //   console.log({ schedule });
  //   console.log({ time });

  //   const selectedTime = parse(
  //     `${date} ${time}`,
  //     'dd/MM/yyyy HH:mm',
  //     new Date(),
  //   );
  //   // const today = format(new Date(), 'dd/MM/yyyy');
  //   const currentOpeningTime = parse(
  //     `${date} ${schedule?.opening_hour}`,
  //     'dd/MM/yyyy HH:mm:ss',
  //     new Date(),
  //   );
  //   const currentClosingTime = parse(
  //     `${date} ${schedule?.closing_hour}`,
  //     'dd/MM/yyyy HH:mm:ss',
  //     new Date(),
  //   );

  //   console.log(
  //     selectedTime,
  //     currentOpeningTime,
  //     currentClosingTime,
  //     addMinutes(date, 30),
  //   );

  //   if (
  //     !schedule ||
  //     selectedTime < currentOpeningTime ||
  //     selectedTime > currentClosingTime
  //   ) {
  //     throw new HttpException(
  //       'Doctor not available at the selected date and time.',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const existingAppointment = await this.appointmentsRepository.findOne({
  //     where: { practitioner, startTime: selectedTime },
  //   });

  //   if (existingAppointment) {
  //     throw new HttpException(
  //       'An appointment already exists at the selected time.',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   // const newAppointment = this.appointmentsRepository.create({
  //   //   practitioner,
  //   //   user: patient,
  //   //   startTime: selectedTime,
  //   //   endTime: addMinutes(date, 30),
  //   // });
  // }

  // async createAppointment(
  //   userId: number,
  //   practitionerId: number,
  //   date: string,
  //   time: string,
  //   timeZone: string,
  // ) {
  //   const utcDate = moment
  //     .tz(`${date}T${time}`, timeZone)
  //     .utc()
  //     .format('YYYY-MM-DD');
  //   const utcTime = moment
  //     .tz(`${date}T${time}`, timeZone)
  //     .utc()
  //     .format('HH:mm');
  // }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { userId, practitionerId, date, time, timeZone } =
      createAppointmentDto;

    const practitioner =
      await this.practitionersService.findById(practitionerId);

    if (!practitioner) {
      throw new HttpException(
        `No Practitioner with ID${practitionerId} found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new HttpException(
        `No Patient with ID${userId} found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Convert the date and time to UTC
    const utcDate = moment
      .tz(`${date}T${time}`, timeZone)
      .utc()
      .format('YYYY-MM-DD');
    const utcTime = moment
      .tz(`${date}T${time}`, timeZone)
      .utc()
      .format('HH:mm');

    // Get the available slots for the practitioner
    const availableSlots = await this.schedulesService.getAvailableSlots(
      practitionerId,
      timeZone,
    );

    // Check if the selected date and time is available
    if (!availableSlots[date].includes(time)) {
      throw new HttpException(
        'This slot is not available.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the slot is already booked
    const appointment = await this.appointmentsRepository.findOne({
      where: { practitioner, time: utcTime, date: utcDate },
    });

    if (appointment) {
      throw new HttpException(
        'This slot is already booked.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // If the slot is available and not booked, create the appointment
    const newAppointment = this.appointmentsRepository.create({
      user: user,
      practitioner: practitioner,
      time: utcTime,
      date: utcDate,
    });
    await this.appointmentsRepository.save(newAppointment);

    return newAppointment;
  }
}
