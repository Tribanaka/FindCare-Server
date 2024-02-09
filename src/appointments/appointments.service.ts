import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PractitionersService } from 'src/practitioners/practitioners.service';
import { UsersService } from 'src/users/users.service';
import { SchedulesService } from 'src/schedules/schedules.service';
import * as moment from 'moment-timezone';
import { Practitioner } from 'src/practitioners/practitioner.entity';
import paginate from 'src/pagination';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Cron } from '@nestjs/schedule';
import { FindAppointmentDto } from './dto/find-appointment.dto';

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

  private readonly logger = new Logger(AppointmentsService.name);

  @Cron('*/30 * * * *')
  async handleCron() {
    this.logger.debug('Called at every 30th Minute');

    const now = moment().utc();

    const pendingAppointments = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where('appointment.status = :status', {
        status: AppointmentStatus.PENDING,
      })
      .getMany();

    for (const appointment of pendingAppointments) {
      const appointmentTime = moment.utc(
        `${appointment.date} ${appointment.time}`,
        'YYYY-MM-DD HH:mm',
      );

      if (now.isAfter(appointmentTime)) {
        appointment.status = AppointmentStatus.MISSED;
        await this.appointmentsRepository.save(appointment);
      }
    }
  }

  findOne(practitioner: Practitioner, date: string, time: string) {
    return this.appointmentsRepository.findOneBy({ practitioner, date, time });
  }

  findAll(practitioner: Practitioner, date: string, time?: string) {
    return this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where('appointment.date >= :startDate', { startDate: date })
      .getMany();
  }

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

    // Convert date from 'DD-MM-YYYY' to 'YYYY-MM-DD'
    const formattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');

    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes}`;

    const appointmentTime = moment.tz(
      `${formattedDate}T${formattedTime}`,
      timeZone,
    );

    // Get the current time in the practitioner's time zone (Nigerian time)
    const currentTime = moment.tz('Africa/Lagos');

    // Check if the appointment time is in the future
    if (appointmentTime.isSameOrBefore(currentTime)) {
      throw new HttpException(
        'The appointment time must be in the future.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Convert the date and time to UTC
    const utcDate = moment
      .tz(`${formattedDate}T${formattedTime}`, timeZone)
      .utc()
      .format('YYYY-MM-DD');
    const utcTime = moment
      .tz(`${formattedDate}T${formattedTime}`, timeZone)
      .utc()
      .format('HH:mm');

    // Get the available slots for the practitioner
    const availableSlots = await this.schedulesService.getAvailableSlots(
      practitionerId,
      { timeZone },
    );

    // Check if the selected date and time is available
    if (
      !availableSlots.some(
        (slot) =>
          slot.date === formattedDate && slot.timeSlots.includes(formattedTime),
      )
    ) {
      throw new HttpException(
        'The selected date and time slot is not available.',
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

  async findByUser(userId: number, findApppointmentDto: FindAppointmentDto) {
    if (!userId) throw new BadRequestException("Please input User's ID");

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { status, skip, ...paginateOption } = findApppointmentDto;

    const query = this.appointmentsRepository.createQueryBuilder('appointment');

    query
      .leftJoinAndSelect('appointment.practitioner', 'practitioner')
      .leftJoinAndSelect('appointment.user', 'user')
      .where('user.id = :userId', {
        userId: user.id,
      });

    if (status) {
      query.andWhere('appointment.status = :status', {
        status,
      });
    }
    return paginate(query, 'appointment.id', { ...paginateOption, skip });
  }

  async findByPractitioner(
    practitionerId: number,
    findApppointmentDto: FindAppointmentDto,
  ) {
    if (!practitionerId)
      throw new BadRequestException("Please input Practitioner's ID");
    const practitioner =
      await this.practitionersService.findById(practitionerId);

    if (!practitioner) {
      throw new HttpException('Practitioner not found', HttpStatus.NOT_FOUND);
    }

    const { status, skip, ...paginateOption } = findApppointmentDto;

    // Create Query Builder
    const query = this.appointmentsRepository.createQueryBuilder('appointment');
    query
      .leftJoinAndSelect('appointment.practitioner', 'practitioner')
      .leftJoinAndSelect('appointment.user', 'user')
      .where('practitioner.id = :practitionerId', {
        practitionerId: practitioner.id,
      });

    if (status) {
      query.andWhere('appointment.status = :status', {
        status,
      });
    }

    return paginate(query, 'appointment.id', { ...paginateOption, skip });
  }

  async updateByPractitioner(
    appointmentId: number,
    updateAppointmentDto: UpdateAppointmentDto,
    request: any,
  ) {
    const { time, timeZone, date } = updateAppointmentDto;

    const appointment = await this.appointmentsRepository.findOne({
      where: { id: appointmentId },
      relations: ['practitioner'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (request.practitioner?.email !== appointment.practitioner.email) {
      throw new UnauthorizedException('Practitioner not authorized');
    }

    if (time || date || timeZone) {
      if (!date) {
        throw new HttpException(
          'date field is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!timeZone) {
        throw new HttpException(
          'timeZone field is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!time) {
        throw new HttpException(
          'time field is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Convert date from 'DD-MM-YYYY' to 'YYYY-MM-DD'
      const formattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');

      const [hours, minutes] = time.split(':');
      const formattedTime = `${hours.padStart(2, '0')}:${minutes}`;

      const appointmentTime = moment.tz(
        `${formattedDate}T${formattedTime}`,
        timeZone,
      );

      // Get the current time in the practitioner's time zone (Nigerian time)
      const currentTime = moment.tz('Africa/Lagos');

      // Check if the appointment time is in the future
      if (appointmentTime.isSameOrBefore(currentTime)) {
        throw new HttpException(
          'The appointment time must be in the future.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get the available slots for the practitioner
      const availableSlots = await this.schedulesService.getAvailableSlots(
        appointment.practitioner.id,
        { timeZone },
      );

      // Check if the selected date and time is available
      if (
        !availableSlots.some(
          (slot) =>
            slot.date === formattedDate &&
            slot.timeSlots.includes(formattedTime),
        )
      ) {
        throw new HttpException(
          'The selected date and time slot is not available.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updatedAppointment = this.appointmentsRepository.merge(
      appointment,
      updateAppointmentDto,
    );

    this.appointmentsRepository.save(updatedAppointment);

    return updatedAppointment;
  }

  async updateByUser(
    appointmentId: number,
    updateAppointmentDto: UpdateAppointmentDto,
    request: any,
  ) {
    const { time, timeZone, date } = updateAppointmentDto;

    const appointment = await this.appointmentsRepository.findOne({
      where: { id: appointmentId },
      relations: ['user', 'practitioner'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (request.user?.email !== appointment.user.email) {
      throw new UnauthorizedException('User not authorized');
    }

    if (time || date || timeZone) {
      if (!date) {
        throw new HttpException(
          'date field is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!timeZone) {
        throw new HttpException(
          'timeZone field is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!time) {
        throw new HttpException(
          'time field is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Convert date from 'DD-MM-YYYY' to 'YYYY-MM-DD'
      const formattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');

      const [hours, minutes] = time.split(':');
      const formattedTime = `${hours.padStart(2, '0')}:${minutes}`;

      const appointmentTime = moment.tz(
        `${formattedDate}T${formattedTime}`,
        timeZone,
      );

      // Get the current time in the practitioner's time zone (Nigerian time)
      const currentTime = moment.tz('Africa/Lagos');

      // Check if the appointment time is in the future
      if (appointmentTime.isSameOrBefore(currentTime)) {
        throw new HttpException(
          'The appointment time must be in the future.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Convert the date and time to UTC
      const utcDate = moment
        .tz(`${formattedDate}T${formattedTime}`, timeZone)
        .utc()
        .format('YYYY-MM-DD');
      const utcTime = moment
        .tz(`${formattedDate}T${formattedTime}`, timeZone)
        .utc()
        .format('HH:mm');

      // Get the available slots for the practitioner
      const availableSlots = await this.schedulesService.getAvailableSlots(
        appointment.practitioner.id,
        { timeZone },
      );

      // Check if the selected date and time is available
      if (
        !availableSlots.some(
          (slot) =>
            slot.date === formattedDate &&
            slot.timeSlots.includes(formattedTime),
        )
      ) {
        throw new HttpException(
          'The selected date and time slot is not available.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedAppointment = this.appointmentsRepository.merge(
        appointment,
        { ...updateAppointmentDto, date: utcDate, time: utcTime },
      );

      return this.appointmentsRepository.save(updatedAppointment);
    }

    const updatedAppointment = this.appointmentsRepository.merge(
      appointment,
      updateAppointmentDto,
    );

    await this.appointmentsRepository.save(updatedAppointment);

    return updatedAppointment;
  }
}
