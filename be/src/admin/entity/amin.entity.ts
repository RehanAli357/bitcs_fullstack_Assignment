import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Check(`"roleId" IN (${process.env.ADMIN_ROLE})`)
export class Admin {
  @PrimaryGeneratedColumn()
  aId: string;

  @Column()
  aName: string;

  @Column({ length: 255 })
  aPassword: string;

  @Column()
  createdTime: Date;

  @Column()
  aEmail: string;

  @Column()
  roleId: string;
}
