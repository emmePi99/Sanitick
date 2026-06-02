export class UserCreatedEvent {
  static readonly KEY = 'user.created';

  constructor(
    public readonly email: string,
    public readonly token: string | null,
  ) {}
}
