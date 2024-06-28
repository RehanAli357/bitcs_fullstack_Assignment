import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Check(`"roleId" IN (${process.env.SELLER_ROLE})`)
export class Seller {
  @PrimaryGeneratedColumn()
  sId: string;

  @Column()
  sName: string;

  @Column({ length: 255 })
  sPassword: string;

  @Column()
  createdTime: Date;

  @Column()
  sEmail: string;

  @Column()
  roleId: string;
}
