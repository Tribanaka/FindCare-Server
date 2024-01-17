import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Repository } from 'typeorm';
import { Practitioner } from 'src/practitioners/practitioner.entity';
import { CreateSchedulesDto } from './dto/create-schedule.dto';
import { PractitionersService } from 'src/practitioners/practitioners.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import * as moment from 'moment-timezone';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRespository: Repository<Schedule>,
    private practitionersService: PractitionersService,
    @Inject(forwardRef(() => AppointmentsService))
    private appointmentsServices: AppointmentsService,
  ) {}

  findOne(practitioner: Practitioner, dayOfWeek: string) {
    return this.schedulesRespository.findOne({
      where: { practitioner, day_of_week: dayOfWeek },
    });
  }

  async createWeeklySchedule(
    practitionerId: number,
    createSchedulesDto: CreateSchedulesDto,
  ): Promise<Schedule[]> {
    const practitioner =
      await this.practitionersService.findById(practitionerId);

    if (!practitioner) {
      throw new HttpException(
        `Practitioner with ${practitionerId} ID not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingSchedules = await this.schedulesRespository.find({
      where: { practitioner },
    });

    if (existingSchedules.length) {
      throw new HttpException(
        'A schedule already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newSchedules = createSchedulesDto.schedules.map((schedule) => {
      const newSchedule = this.schedulesRespository.create({
        practitioner,
        day_of_week: schedule.dayOfWeek,
        opening_hour: schedule.openingHour,
        closing_hour: schedule.closingHour,
      });

      // if (schedule.openingHour >= schedule.closingHour) {
      //   throw new HttpException(
      //     'Closing hour cannot be less than or equal to opening hour',
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      return newSchedule;
    });

    await this.schedulesRespository.save(newSchedules);

    return newSchedules;
  }

  async updateWeeklySchedule(
    practitionerId: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const practitioner =
      await this.practitionersService.findById(practitionerId);

    if (!practitioner) {
      throw new HttpException(
        `No Practitioner with ID ${practitionerId} found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const existingSchedules = await this.schedulesRespository.find({
      where: { practitioner },
    });

    if (!existingSchedules.length) {
      throw new HttpException(
        'No schedule exists for this practitioner. Please create a schedule before editing',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.schedulesRespository.remove(existingSchedules);

    const newSchedules = updateScheduleDto.schedules.map((schedule) => {
      const newSchedule = this.schedulesRespository.create({
        practitioner,
        day_of_week: schedule.dayOfWeek,
        opening_hour: schedule.openingHour,
        closing_hour: schedule.closingHour,
      });

      return newSchedule;
    });

    await this.schedulesRespository.save(newSchedules);

    return newSchedules;
  }

  async getAvailableSlots(practitionerId: number, timeZone: string) {
    const practitioner =
      await this.practitionersService.findById(practitionerId);

    if (!practitioner) {
      throw new HttpException(
        `No Practitioner with ID${practitionerId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const schedules = await this.schedulesRespository.findBy({ practitioner });

    if (!schedules) {
      throw new HttpException(
        `No Practitioner with ID${practitionerId} hasn't created a schedule`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Create a date object for today's date
    let currentDate = moment.tz(moment().format('YYYY-MM-DD'), timeZone);

    // Create an array to store the slots
    let slots = [];

    // Loop over the next 4 weeks
    for (let i = 0; i < 28; i++) {
      // Get the current day of the week
      let currentDayOfWeek = currentDate.format('dddd');

      // Find the schedule for the current day of the week
      let schedule = schedules.find(
        (schedule) => schedule.day_of_week === currentDayOfWeek,
      );

      // If a schedule exists for the current day of the week
      if (schedule) {
        let start = moment.tz(
          `${currentDate.format('YYYY-MM-DD')}T${schedule.opening_hour}+01:00`,
          timeZone,
        );
        let end = moment.tz(
          `${currentDate.format('YYYY-MM-DD')}T${schedule.closing_hour}+01:00`,
          timeZone,
        );

        // Create an array to store the available times for the current day
        let timeSlots = [];

        while (start.isBefore(end)) {
          // Convert the time to UTC
          // const utcTime = start.utc().format('HH:mm');

          // Check if an appointment already exists at this time
          // const appointment = await this.appointmentsServices.findOne(
          //   practitioner,
          //   currentDate.utc().format('YYYY-MM-DD'),
          //   utcTime,
          // );
          // if (!appointment.length) {
          //   timeSlots.push(start.format('HH:mm'));
          // } else {
          //   console.log(appointment);
          // }

          if (start.isAfter(moment())) {
            timeSlots.push(start.format('HH:mm'));
          }

          start.add(30, 'minutes');
        }

        // Add the slots for the current day to the slots array
        if (timeSlots.length) {
          slots.push({
            date: currentDate.format('YYYY-MM-DD'),
            day: currentDayOfWeek,
            timeSlots: timeSlots,
          });
        }
      }

      // Move to the next day
      currentDate.add(1, 'days');
    }

    return slots;
  }
}
