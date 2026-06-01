export interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}
