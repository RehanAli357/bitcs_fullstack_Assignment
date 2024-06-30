import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Check(`"roleId" IN (${process.env.SELLER_ROLE})`)
export class Bike {
  @PrimaryGeneratedColumn()
  bId: string;

  @Column()
  bName: string;

  @Column()
  bType: string;

  @Column()
  bPrice: number;

  @Column()
  available: boolean;
  
  @Column()
  bImage:string;
  
  @Column()
  sId:string;

  @Column()
  cId:string;
  
  @Column()
  createdTime: Date;
}
