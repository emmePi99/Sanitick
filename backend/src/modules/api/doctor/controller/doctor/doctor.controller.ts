import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorCoreService } from 'src/modules/core/doctor/service/doctor/doctor-core.service';
import { CreateDoctorDto } from '../../dto/create-doctor.dto';
import { Roles } from 'src/modules/api/auth/decorator/roles.decorator';
import { UserRole } from '@shared/index';
import { JwtAuthGuard } from 'src/modules/api/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/api/auth/guard/roles.guard';
import { Crud, CrudController } from '@dataui/crud';
import { Doctor } from 'src/modules/core/doctor/entity/doctor/doctor.entity';

@ApiTags('doctor')
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new doctor (Admin only)' })
    @ApiResponse({ status: 201, description: 'Doctor created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async createDoctor(@Body() createDoctorDto: CreateDoctorDto): Promise<void> {
        return this.service.createDoctorWithUser(createDoctorDto);
    }
}
