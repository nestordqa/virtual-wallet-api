import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transactions.entity';
import { User } from '../users/users.entity';

@Module({
	imports:[TypeOrmModule.forFeature([Transaction, User])],
	controllers:[TransactionsController],
	providers:[TransactionsService],
})
export class TransactionsModule {}
