import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async loadBalance(userId: number, amount: number): Promise<User> {
        if (amount <= 0) {
            throw new Error('Amount must be greater than zero');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        user.balance += amount; // Incrementar el balance
        return this.userRepository.save(user); // Guardar el usuario actualizado
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    async create(userData): Promise<User[]> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async updateBalance(id: number, amount: number): Promise<void> {
        await this.userRepository.increment({ id }, 'balance', amount);
    }
}
