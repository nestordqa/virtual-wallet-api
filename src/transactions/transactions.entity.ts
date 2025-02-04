import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.sentTransactions)
    sender: User;

    @ManyToOne(() => User, user => user.receivedTransactions)
    receiver: User;

    @Column('decimal')
    amount: number;

    @Column({ default: 'pending' }) // estados posibles: pending, success, failed.
    status: 'pending' | 'success' | 'failed';

    @Column()
    createdAt: Date;
}
