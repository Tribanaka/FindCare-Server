export class CreateScheduleDto {
  schedules: {
    dayOfWeek: string;
    openingTime: string;
    closingTime: string;
  }[];
}
