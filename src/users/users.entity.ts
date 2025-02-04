import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from '../transactions/transactions.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string; // Almacenar hash de la contraseña

    @Column({ default: 0 })
    balance: number;

    @OneToMany(() => Transaction, transaction => transaction.sender)
    sentTransactions: Transaction[];

    @OneToMany(() => Transaction, transaction => transaction.receiver)
    receivedTransactions: Transaction[];
}
