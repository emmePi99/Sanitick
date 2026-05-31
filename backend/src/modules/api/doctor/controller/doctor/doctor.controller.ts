import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { DoctorCoreService } from 'src/modules/core/doctor/service/doctor/doctor-core.service';
import { CreateDoctorDto } from '../../dto/create-doctor.dto';
import { Roles } from 'src/modules/api/auth/decorator/roles.decorator';
import { UserRole } from '@shared/index';
import { JwtAuthGuard } from 'src/modules/api/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/api/auth/guard/roles.guard';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorController {
    constructor(private readonly doctorService: DoctorCoreService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async createDoctor(@Body() createDoctorDto: CreateDoctorDto): Promise<void> {
        return this.doctorService.createDoctorWithUser(createDoctorDto);
    }
}
