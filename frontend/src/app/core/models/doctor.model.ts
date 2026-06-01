export interface Doctor {
  id: string;
  specialization: string;
  registrationNumber: string;
  clinicAddress: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
