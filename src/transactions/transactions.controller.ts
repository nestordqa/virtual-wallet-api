import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { sendResponse } from 'src/utils/sendResponse';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    async create(@Body() transactionData, @Res() res) {
        const { senderId, receiverEmail, amount } = transactionData; // Cambiado a receiverEmail
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

    @Get(':userId') // Cambiado para aceptar un userId
    async findAll(@Param('userId') userId: number, @Res() res) {
        try {
            const transactions = await this.transactionsService.findAllByUser(userId);
            return sendResponse(res, true, '00', null, transactions);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }
}
