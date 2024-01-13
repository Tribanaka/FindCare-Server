export class CreateScheduleDto {
  schedules: {
    dayOfWeek: string;
    openingHour: string;
    closingHour: string;
  }[];
}
