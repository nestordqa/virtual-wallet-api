import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { sendResponse } from 'src/utils/sendResponse';
import { LoginDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() userDto: LoginDto, @Res() res: Response) {
        const user = await this.authService.validateUser(userDto.email, userDto.password);
        if (!user) {
            return sendResponse(res, false, '02', 'Invalid credentials'); // User not found
        }
        const token = await this.authService.login(user);
        return sendResponse(res, true, '00', null, token); // Return the JWT token
    }
}
