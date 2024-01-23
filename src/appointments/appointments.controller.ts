import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PaginationOptionsDto } from 'src/pagination';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get('practitioners/:practitionerId')
  findPractitionerAppointments(
    @Param('practitionerId') practitionerId: number,
    @Query() paginationOptionsDto: PaginationOptionsDto,
  ) {
    return this.appointmentsService.findByPractitioner(
      practitionerId,
      paginationOptionsDto,
    );
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
