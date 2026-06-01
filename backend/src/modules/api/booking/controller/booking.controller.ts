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
import { Crud, CrudController, type CrudRequest, ParsedRequest, Override, CrudAuth } from '@dataui/crud';
import { Booking } from '../../../core/booking/entity/booking/booking.entity';

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
  async getMany(@ParsedRequest() req: CrudRequest, @Req() authReq: AuthenticatedRequest) {
    req.parsed.filter.push({ field: 'patientId', operator: '$eq', value: authReq.user.sub });
    return this.base.getManyBase!(req);
  }

  @Override('getOneBase')
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@ParsedRequest() req: CrudRequest, @Req() authReq: AuthenticatedRequest) {
    req.parsed.filter.push({ field: 'patientId', operator: '$eq', value: authReq.user.sub });
    return this.base.getOneBase!(req);
  }

  @Get('availability/:doctorId/:year/:month')
  async getAvailableDates(
    @Param('doctorId') doctorId: string,
    @Param('year') year: number,
    @Param('month') month: number,
  ) {
    return await this.availabilityService.getAvailableDates(doctorId, year, month, 30);
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
    return (this.service as BookingCoreService).createBooking(createBookingDto, req.user.sub);
  }
}

