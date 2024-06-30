import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BikeTaken {
  @PrimaryGeneratedColumn()
  btId: string;

  @Column()
  bId:string;

  @Column()
  bTime: number;
  
  @Column()
  bIncome: number;
  
  @Column()
  sId:string;

  @Column()
  createdTime: Date;
}
