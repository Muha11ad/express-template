import { Transaction } from './transaction.model';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@OneToMany(() => Transaction, (transaction) => transaction.sender)
	transactions: Transaction[];
}
