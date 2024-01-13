import { format, parse } from 'date-fns';

const getDayOfWeek = (dateString: string) => {
  // const date = parse(dateString, 'dd-MM-yyy', new Date());

  const date = parse(dateString, 'dd/MM/yyyy', new Date());

  return format(date, 'EEEE');
};

export default getDayOfWeek;
