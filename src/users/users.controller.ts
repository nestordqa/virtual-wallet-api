import { Controller, Get, Post, Body, Param, Res, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { sendResponse } from 'src/utils/sendResponse';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Asegúrate de que la ruta sea correcta

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard) // Protege la ruta con el guardia JWT
    @Get()
    async findAll(@Res() res) {
        try {
            const users = await this.usersService.findAll();
            return sendResponse(res, true, '00', null, users);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }

    @Post()
    async create(@Body() userData: any, @Res() res) {
        try {
            const user = await this.usersService.create(userData);
            return sendResponse(res, true, '00', null, user);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }

    @UseGuards(JwtAuthGuard) // Protege la ruta con el guardia JWT
    @Get(':id')
    async findOne(@Param('id') id: number, @Res() res) {
        try {
            const user = await this.usersService.findOne(id);
            if (!user) {
                return sendResponse(res, false, '02'); // User not found
            }
            return sendResponse(res, true, '00', null, user);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }

    @UseGuards(JwtAuthGuard) // Protege la ruta con el guardia JWT
    @Post(':id/load-balance')
    async loadBalance(@Param('id') id: number, @Body('amount') amount: number, @Res() res) {
        try {
            const user = await this.usersService.loadBalance(id, amount);
            return sendResponse(res, true, '00', null, user);
        } catch (error) {
            if (error.message === 'User not found') {
                return sendResponse(res, false, '02'); // User not found
            }
            if (error.message === 'Amount must be greater than zero') {
                return sendResponse(res, false, '01', error.message); // Invalid amount
            }
            return sendResponse(res, false, '01', error.message); // Internal Server Error
        }
    }
}
