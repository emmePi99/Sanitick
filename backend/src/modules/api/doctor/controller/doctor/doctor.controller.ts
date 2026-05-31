import { Body, Controller, Post } from '@nestjs/common';
import { DoctorCoreService } from 'src/modules/core/doctor/service/doctor/doctor-core.service';
import { CreateDoctorDto } from '../../dto/create-doctor.dto';
import { Roles } from 'src/modules/api/auth/decorator/roles.decorator';
import { UserRole } from '@shared/index';

@Controller('doctor')
export class DoctorController {
    constructor(private readonly doctorService: DoctorCoreService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    async createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
        return this.doctorService.createDoctorWithUser(createDoctorDto);
    }
}
