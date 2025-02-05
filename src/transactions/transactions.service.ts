import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { User } from '../users/users.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createTransaction(senderId: number, receiverEmail: string, amount: number): Promise<Transaction> {
        const sender = await this.userRepository.findOne({ where: { id: senderId } });
        const receiver = await this.userRepository.findOne({ where: { email: receiverEmail } }); // Buscar por email

        if (!sender || !receiver) {
            throw new Error('Sender or receiver not found');
        }

        if (sender.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Crear transacción.
        const transaction = this.transactionRepository.create({
            sender,
            receiver,
            amount,
            status: 'success', // Suponiendo que la transacción es exitosa.
            createdAt: new Date(),
        });

        // Actualizar balances.
        sender.balance -= amount;
        receiver.balance += amount;
        
        await this.userRepository.save(sender);
        await this.userRepository.save(receiver);
        
        return this.transactionRepository.save(transaction);
    }

    async findAllByUser(userId: number): Promise<Transaction[]> {
        return this.transactionRepository.find({
            where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
            relations: ['sender', 'receiver'],
        });
    }
}
