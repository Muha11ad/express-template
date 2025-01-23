import { User } from './user.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Transaction {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	amount: number;

	@ManyToOne(() => User, (user) => user.transactions)
	sender: User;

	@ManyToOne(() => User, (user) => user.transactions)
	receiver: User;
}
