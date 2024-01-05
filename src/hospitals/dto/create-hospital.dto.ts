export class CreateHospitalDto {
  name: string;
  location: {
    state: string;
    LGA: string;
    city: string;
  };
  practioners: Practioner[];
}

type Practioner = {
  name: string;
  profession: string;
};
