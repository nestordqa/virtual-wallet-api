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

        if (sender.id === receiver.id) {
            throw new Error('Cannot send money to yourself');
        }

        if (sender.balance < amount) {
            throw new Error('Insufficient balance');
        }

        //Generate a ramdon status
        const statuses = ['success', 'failed', 'pending'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        // Crear transacción.
        //@ts-ignore
        const transaction = this.transactionRepository.create({
            sender,
            receiver,
            amount,
            status: randomStatus,
            createdAt: new Date(),
        });

        //@ts-ignore
        await this.transactionRepository.save(transaction);

        // Actualizar balances solo si el estado es "success"
        if (randomStatus === 'success') {
            sender.balance -= amount;
            receiver.balance += amount;

            await this.userRepository.save(sender);
            await this.userRepository.save(receiver);
        }
        //@ts-ignore
        return transaction;
    }

    async findAllByUser(userId: number): Promise<Transaction[]> {
        return this.transactionRepository.find({
            where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
            relations: ['sender', 'receiver'],
        });
    }
}
