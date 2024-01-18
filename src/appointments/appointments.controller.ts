import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get('practitioners/:practitionerId')
  findPractitionerAppointments(
    @Param('practitionerId') practitionerId: number,
  ) {
    return this.appointmentsService.findByPractitioner(practitionerId);
  }

  @Get('users/:userId')
  findPatientAppointments(@Param('userId') userId: number) {
    return this.appointmentsService.findByUser(userId);
  }
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }
}
