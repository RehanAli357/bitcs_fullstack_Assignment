import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()

export class CustomerPayment{
    @PrimaryGeneratedColumn()
    cpId:string;

    @Column()
    payment:number;

    @Column()
    bTime:number;

    @Column()
    bId:string;

    @Column()
    cId:string;

    @Column()
    createdTime:Date;
}