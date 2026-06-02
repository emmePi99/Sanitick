import { Injectable, Logger } from '@nestjs/common';
import { BookingCoreService } from '../../../core/booking/service/booking/booking-core.service';
import { DoctorScheduleCoreService } from '../../../core/doctor-schedule/service/doctor-schedule-core/doctor-schedule-core.service';
import dayjs from 'dayjs';
import { DoctorSchedule } from 'src/modules/core/doctor-schedule/entity/doctor-schedule.entity';
import { Booking } from 'src/modules/core/booking/entity/booking/booking.entity';

@Injectable()
export class AvailabilityService {
  private readonly logger = new Logger(AvailabilityService.name);

  constructor(
    private readonly bookingCoreService: BookingCoreService,
    private readonly doctorScheduleCoreService: DoctorScheduleCoreService,
  ) {}

  async getAvailableSlots(
    doctorId: string,
    date: string,
    durationInMinutes: number,
  ): Promise<string[]> {
    const targetDate = dayjs(date);
    const dayOfWeek = targetDate.day();
    const schedules = await this.doctorScheduleCoreService.findByDoctorAndDay(
      doctorId,
      dayOfWeek,
    );
    const bookings = await this.bookingCoreService.findByDoctorAndDate(
      doctorId,
      targetDate.toDate(),
    );
    const availableSlots: string[] = [];

    for (const schedule of schedules) {
      const scheduleSlots = this.extractAvailableSlotFromSchedule(
        targetDate,
        schedule,
        bookings,
        durationInMinutes,
      );
      availableSlots.push(...scheduleSlots);
    }

    return availableSlots;
  }

  async getAvailableDates(
    doctorId: string,
    year: number,
    month: number,
    duration: number,
  ): Promise<string[]> {
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
    const availableDates: string[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
      const slots = await this.getAvailableSlots(doctorId, dateStr, duration);
      if (slots.length > 0) {
        availableDates.push(dateStr);
      }
    }
    return availableDates;
  }

  private extractAvailableSlotFromSchedule(
    targetDate: dayjs.Dayjs,
    schedule: DoctorSchedule,
    bookings: Booking[],
    durationInMinutes: number,
  ) {
    const dateStr = targetDate.format('YYYY-MM-DD');
    const startTime = dayjs(`${dateStr}T${schedule.startTime}:00`);
    const endTime = dayjs(`${dateStr}T${schedule.endTime}:00`);

    return this.extractAvailableSlotsByStartAndEnd(
      startTime,
      endTime,
      durationInMinutes,
      bookings,
    );
  }

  private extractAvailableSlotsByStartAndEnd(
    startTime: dayjs.Dayjs,
    endTime: dayjs.Dayjs,
    durationInMinutes: number,
    bookings: Booking[],
  ) {
    const availableSlots: string[] = [];

    while (
      startTime.add(durationInMinutes, 'minute').isBefore(endTime) ||
      startTime.add(durationInMinutes, 'minute').isSame(endTime)
    ) {
      const slotStart = startTime;
      const slotEnd = startTime.add(durationInMinutes, 'minute');

      // Verifica sovrapposizioni
      const isOccupied = bookings.some((booking) => {
        const bookingStart = dayjs(booking.startTime);
        const bookingEnd = dayjs(booking.endTime);

        return slotStart.isBefore(bookingEnd) && slotEnd.isAfter(bookingStart);
      });

      if (!isOccupied) {
        availableSlots.push(slotStart.format('HH:mm'));
      }

      startTime = startTime.add(durationInMinutes, 'minute');
    }

    return availableSlots;
  }
}
