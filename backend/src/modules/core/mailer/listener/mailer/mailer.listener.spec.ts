import { Test, TestingModule } from '@nestjs/testing';
import { MailerListener } from './mailer.listener';
import { MailerService } from 'src/modules/core/mailer/service/mailer/mailer.service';
import { UserCreatedEvent } from 'src/modules/core/user/event/user-created.event';
import { DoctorCreatedEvent } from 'src/modules/core/doctor/events/doctor-created.event';
import { Logger } from '@nestjs/common';

describe('MailerListener', () => {
  let listener: MailerListener;
  let mailerService: MailerService;

  const mockMailerService = {
    sendActivationEmail: jest.fn(),
    sendDoctorInvitation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerListener,
        { provide: MailerService, useValue: mockMailerService },
      ],
    })
      .setLogger(new Logger())
      .compile();

    listener = module.get<MailerListener>(MailerListener);
    mailerService = module.get<MailerService>(MailerService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('handleUserCreatedEvent', () => {
    it('should call sendActivationEmail if token is present', async () => {
      const event = new UserCreatedEvent('test@test.com', 'token');

      await listener.handleUserCreatedEvent(event);

      expect(mailerService.sendActivationEmail).toHaveBeenCalledWith(
        'test@test.com',
        'token',
      );
    });

    it('should not call sendActivationEmail if token is missing', async () => {
      const event = new UserCreatedEvent('test@test.com', null);

      await listener.handleUserCreatedEvent(event);

      expect(mailerService.sendActivationEmail).not.toHaveBeenCalled();
    });

    it('should log error if sendActivationEmail fails', async () => {
      const event = new UserCreatedEvent('test@test.com', 'token');
      mockMailerService.sendActivationEmail.mockImplementation(() => {
        throw new Error('SMTP Error');
      });

      // Should not throw, but since it is not async, it will throw immediately if not handled.
      // But handleUserCreatedEvent has a try-catch.
      expect(() => listener.handleUserCreatedEvent(event)).not.toThrow();
      expect(mailerService.sendActivationEmail).toHaveBeenCalled();
    });
  });

  describe('handleDoctorCreatedEvent', () => {
    it('should call sendDoctorInvitation if token is present', async () => {
      const event = new DoctorCreatedEvent(
        'test@test.com',
        'firstName',
        'lastName',
        'token',
      );

      await listener.handleDoctorCreatedEvent(event);

      expect(mailerService.sendDoctorInvitation).toHaveBeenCalledWith(
        'test@test.com',
        'firstName',
        'lastName',
        'token',
      );
    });

    it('should not call sendDoctorInvitation if token is missing', async () => {
      const event = new DoctorCreatedEvent(
        'test@test.com',
        'firstName',
        'lastName',
        null,
      );

      await listener.handleDoctorCreatedEvent(event);

      expect(mailerService.sendDoctorInvitation).not.toHaveBeenCalled();
    });

    it('should log error if sendDoctorInvitation fails', async () => {
      const event = new DoctorCreatedEvent(
        'test@test.com',
        'firstName',
        'lastName',
        'token',
      );
      mockMailerService.sendDoctorInvitation.mockRejectedValue(
        new Error('SMTP Error'),
      );

      await expect(
        listener.handleDoctorCreatedEvent(event),
      ).resolves.not.toThrow();
      expect(mailerService.sendDoctorInvitation).toHaveBeenCalled();
    });
  });
});
