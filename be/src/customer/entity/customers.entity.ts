import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Check(`"roleId" IN (${process.env.CUSTOMER_ROLE})`)
export class Customer {
  @PrimaryGeneratedColumn()
  cId: string;

  @Column()
  cName: string;

  @Column({ length: 255 })
  cPassword: string;

  @Column()
  createdTime: Date;

  @Column()
  cEmail: string;

  @Column()
  roleId: string;
}
