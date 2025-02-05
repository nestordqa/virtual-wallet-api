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
    async create(@Body() userData: { password: string, email: string }, @Res() res) {
        try {
            const user = await this.usersService.create(userData);
            return sendResponse(res, true, '00', null, user);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }

    @UseGuards(JwtAuthGuard) // Protege la ruta con el guardia JWT
    @Get('/profile')
    async findOne(@Request() req: any, @Res() res) {
        try {
            const userId = req.user.sub; // Extrae el ID del usuario desde el token
            const user = await this.usersService.findOne(userId);
            if (!user) {
                return sendResponse(res, false, '02'); // User not found
            }
            return sendResponse(res, true, '00', null, user);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }

    @UseGuards(JwtAuthGuard) // Protege la ruta con el guardia JWT
    @Post('/load-balance')
    async loadBalance(@Body('amount') amount: number, @Request() req: any, @Res() res) {
        try {
            const userId = req.user.sub; // Extrae el ID del usuario desde el token
            const user = await this.usersService.loadBalance(userId, amount); // Usa el ID del token o el del param
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
