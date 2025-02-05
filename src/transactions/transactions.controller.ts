import { Controller, Post, Body, Get, Param, Res, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { sendResponse } from 'src/utils/sendResponse';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Asegúrate de que la ruta sea correcta

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @UseGuards(JwtAuthGuard) // Protege la ruta con el guardia JWT
    @Post()
    async create(@Body() transactionData: { receiverEmail: string; amount: number }, @Request() req: any, @Res() res) {
        const senderId = req.user.sub; // Extrae el ID del usuario del token
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

    @UseGuards(JwtAuthGuard) // Protege la ruta con el guardia JWT
    @Get()
    async findAll(@Request() req: any, @Res() res) {
        const userId = req.user.sub; // Extrae el ID del usuario del token

        try {
            const transactions = await this.transactionsService.findAllByUser(userId);
            return sendResponse(res, true, '00', null, transactions);
        } catch (error) {
            return sendResponse(res, false, '01', error.message);
        }
    }
}
