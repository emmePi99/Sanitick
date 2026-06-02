import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { DoctorCoreService } from 'src/modules/core/doctor/service/doctor/doctor-core.service';
import { CreateDoctorDto } from '../../dto/create-doctor.dto';
import { Roles } from 'src/modules/api/auth/decorator/roles.decorator';
import { UserRole } from '@shared/index';
import { JwtAuthGuard } from 'src/modules/api/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/api/auth/guard/roles.guard';
import { Crud, CrudController } from '@dataui/crud';
import { Doctor } from 'src/modules/core/doctor/entity/doctor/doctor.entity';

@Crud({
    model: {
        type: Doctor,
    },
    query: {
        join: {
            user: {
                eager: true,
                allow: ['id', 'firstName', 'lastName'],
            },
        },
    },
})
@Controller('doctor')
export class DoctorController implements CrudController<Doctor> {
    constructor(public service: DoctorCoreService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async createDoctor(@Body() createDoctorDto: CreateDoctorDto): Promise<void> {
        return this.service.createDoctorWithUser(createDoctorDto);
    }
}
