import { Controller, Get, Post, Body, Param, Res, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { sendResponse } from 'src/utils/sendResponse';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; 
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

//Controller for Users
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    //Get all users
    @UseGuards(JwtAuthGuard) 
    @Get()
    @ApiResponse({ status: 200, description: 'Retrieve all users' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async findAll(@Res() res) {
        try {
            const users = await this.usersService.findAll();
            return sendResponse(res, true, '00', null, users);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }

    //Create new user
    @Post()
    @ApiBody({
        description: 'Data required to create a user',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'securepassword123' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Create a new user' })
    async create(@Body() userData: { password: string; email: string }, @Res() res) {
        try {
            const user = await this.usersService.create(userData);
            return sendResponse(res, true, '00', null, user);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }

    //Get user profile info
    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    @ApiResponse({ status: 200, description: 'Get user profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async findOne(@Request() req: any, @Res() res) {
        try {
            const userId = req.user.sub; 
            const user = await this.usersService.findOne(userId);
            if (!user) {
                return sendResponse(res, false, '02'); 
            }
            return sendResponse(res, true, '00', null, user);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }

    //Load money to user balance
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        description: 'Amount to load into the user balance',
        schema: {
            type: 'object',
            properties: {
                amount: { type: 'number', example: 100 },
            },
        },
    })
    @Post('/load-balance')
    @ApiResponse({ status: 200, description: 'Load balance for the user' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async loadBalance(@Body('amount') amount: number, @Request() req: any, @Res() res) {
        try {
            const userId = req.user.sub; 
            const user = await this.usersService.loadBalance(userId, amount); 
            return sendResponse(res, true, '00', null, user);
        } catch (error) {
            if (error.message === 'User not found') {
                return sendResponse(res, false, '02'); 
            }
            if (error.message === 'Amount must be greater than zero') {
                return sendResponse(res, false, '01', error.message); 
            }
            return sendResponse(res, false, '01', error.message); 
        }
    }
}
