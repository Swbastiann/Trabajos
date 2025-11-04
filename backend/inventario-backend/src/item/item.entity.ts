import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  categoria: string;

  @Column('int')
  cantidad: number;

  @Column({ nullable: true })
  descripcion: string;
}
