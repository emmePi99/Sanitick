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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AvailabilityService } from '../service/availability.service';
import { BookingCoreService } from '../../../core/booking/service/booking/booking-core.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UserRole } from '@shared';
import type { AuthenticatedRequest } from '../../auth/model/authenticated-request.model';
import { Crud, CrudController, type CrudRequest, ParsedRequest, Override, CrudAuth } from '@dataui/crud';
import { Booking } from '../../../core/booking/entity/booking/booking.entity';

@ApiTags('booking')
@Crud({
  model: {
    type: Booking,
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
  query: {
    join: {
      doctor: { eager: true },
      patient: { eager: false },
    },
  }
})
@Controller('booking')
export class BookingController implements CrudController<Booking> {
  constructor(
    public service: BookingCoreService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  get base(): CrudController<Booking> {
    return this;
  }

  @Override('getManyBase')
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'Return user bookings' })
  async getMany(@ParsedRequest() req: CrudRequest, @Req() authReq: AuthenticatedRequest) {
    req.parsed.filter.push({ field: 'patientId', operator: '$eq', value: authReq.user.sub });
    return this.base.getManyBase!(req);
  }

  @Override('getOneBase')
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific booking by ID' })
  @ApiResponse({ status: 200, description: 'Return booking details' })
  async getOne(@ParsedRequest() req: CrudRequest, @Req() authReq: AuthenticatedRequest) {
    req.parsed.filter.push({ field: 'patientId', operator: '$eq', value: authReq.user.sub });
    return this.base.getOneBase!(req);
  }

  @Get('availability/:doctorId/:year/:month')
  @ApiOperation({ summary: 'Get available dates for a doctor in a specific month' })
  @ApiParam({ name: 'doctorId', type: 'string' })
  @ApiParam({ name: 'year', type: 'number' })
  @ApiParam({ name: 'month', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return list of available dates' })
  async getAvailableDates(
    @Param('doctorId') doctorId: string,
    @Param('year') year: number,
    @Param('month') month: number,
  ) {
    return await this.availabilityService.getAvailableDates(doctorId, year, month, 30);
  }

  @Get('availability/:doctorId/:date')
  @ApiOperation({ summary: 'Get available time slots for a doctor on a specific date' })
  @ApiParam({ name: 'doctorId', type: 'string' })
  @ApiParam({ name: 'date', type: 'string', description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'Return list of available slots' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 409, description: 'Slot conflict or optimistic lock error' })
  async createBooking(@Req() req: AuthenticatedRequest, @Body() createBookingDto: CreateBookingDto) {
    return (this.service as BookingCoreService).createBooking(createBookingDto, req.user.sub);
  }
}

