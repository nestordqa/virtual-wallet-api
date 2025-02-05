import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { sendResponse } from 'src/utils/sendResponse';
import { LoginDto } from '../dto/auth.dto';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

//Controller for Auth
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiBody({
        description: 'User credentials for login',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'securepassword123' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Successful login', type: String })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() userDto: LoginDto, @Res() res: Response) {
        const user = await this.authService.validateUser(userDto.email, userDto.password);
        if (!user) {
            return sendResponse(res, false, '02', 'Invalid credentials'); // User not found
        }
        const token = await this.authService.login(user);
        return sendResponse(res, true, '00', null, token); // Return the JWT token
    }
}
