import { Controller, Post, Body, Get, Res, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { sendResponse } from 'src/utils/sendResponse';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

//Controller for Transactions
@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    // Create a transaction
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiBody({
        description: 'Datos necesarios para crear una transacción',
        schema: {
            type: 'object',
            properties: {
                receiverEmail: { type: 'string', example: 'receiver@example.com' },
                amount: { type: 'number', example: 100 },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Transaction created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Insufficient balance' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async create(@Body() transactionData: { receiverEmail: string; amount: number }, @Request() req: any, @Res() res) {
        const senderId = req.user.sub; // Gets user id from jwt
        const { receiverEmail, amount } = transactionData;

        try {
            const transaction = await this.transactionsService.createTransaction(senderId, receiverEmail, amount);
            return sendResponse(res, true, '00', null, transaction);
        } catch (error) {
            if (error.message === 'Insufficient balance') {
                return sendResponse(res, false, '03'); // Insufficient balance
            }
            return sendResponse(res, false, '01', error.message); // Internal Server Error
        }
    }

    // Get user transactions
    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Retrieve all transactions for the user' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(@Request() req: any, @Res() res) {
        const userId = req.user.sub;

        try {
            const transactions = await this.transactionsService.findAllByUser(userId);
            return sendResponse(res, true, '00', null, transactions);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }
}