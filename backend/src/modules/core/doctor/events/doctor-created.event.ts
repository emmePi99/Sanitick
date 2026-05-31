export class DoctorCreatedEvent {
  static readonly KEY = 'doctor.created';

  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly token: string | null,
  ) {}
}