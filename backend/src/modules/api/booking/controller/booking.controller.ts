import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AvailabilityService } from '../service/availability.service';
import { BookingCoreService } from '../../../core/booking/service/booking/booking-core.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UserRole } from '@shared';
import type { AuthenticatedRequest } from '../../auth/model/authenticated-request.model';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly bookingCoreService: BookingCoreService,
  ) {}

  @Get('availability/:doctorId/:year/:month')
  async getAvailableDates(
    @Param('doctorId') doctorId: string,
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return { doctorId, year, month, dates: ['2026-06-01', '2026-06-02'] };
  }

  @Get('availability/:doctorId/:date')
  async getAvailableSlots(
    @Param('doctorId') doctorId: string,
    @Param('date') date: string,
  ) {
    return this.availabilityService.getAvailableSlots(doctorId, date, 30);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Req() req: AuthenticatedRequest, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingCoreService.createBooking(createBookingDto, req.user.sub);
  }
}

