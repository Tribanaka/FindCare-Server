import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PaginationOptionsDto } from 'src/pagination';
import { PractitionerGuard } from 'src/auth/practitioner.gaurd';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FindAppointmentDto } from './dto/find-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @UseGuards(PractitionerGuard)
  @Get('practitioners/:practitionerId')
  findPractitionerAppointments(
    @Param('practitionerId') practitionerId: number,
    @Query() findApppointmentDto: FindAppointmentDto,
  ) {
    return this.appointmentsService.findByPractitioner(
      practitionerId,
      findApppointmentDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get('users/:userId')
  findPatientAppointments(
    @Param('userId') userId: number,
    @Query() findApppointmentDto: FindAppointmentDto,
  ) {
    return this.appointmentsService.findByUser(userId, findApppointmentDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':appointmentId/users')
  updateUserAppointment(
    @Req() request: Request,
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateByUser(
      appointmentId,
      updateAppointmentDto,
      request,
    );
  }

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }

  @UseGuards(PractitionerGuard)
  @Patch(':appointmentId/practitioners')
  updatePractitionerAppointment(
    @Req() request: Request,
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateByPractitioner(
      appointmentId,
      updateAppointmentDto,
      request,
    );
  }
}
