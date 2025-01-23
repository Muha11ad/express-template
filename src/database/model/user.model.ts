import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'User' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;
}