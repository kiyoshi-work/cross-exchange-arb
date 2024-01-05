import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('cross-ex-arbi')
export class CrossExArbiEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  symbol: string;

  @Column({ nullable: true })
  from_exchange: string;

  @Column({ nullable: true })
  to_exchange: string;

  @Column({ type: 'float', nullable: true })
  thresh_rate: number;


  @Column({ type: 'float', nullable: true })
  num_token_shoud_buy: number;
  @Column({ type: 'float', nullable: true })
  usd_buy: number;
  @Column({ type: 'float', nullable: true })
  pnl: number;
  @Column({ type: 'float', nullable: true })
  pnl_percent: number;
  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
