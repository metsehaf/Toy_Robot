import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

@Entity('robot')
export class Robot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  x: number;

  @Column('int')
  y: number;

  @Column('varchar')
  facing: Direction;

  @CreateDateColumn()
  updatedAt: Date;
}

@Entity('robot_history')
export class RobotHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  robotId: number;

  @Column('int')
  x: number;

  @Column('int')
  y: number;

  @Column('varchar')
  facing: Direction;

  @Column('varchar')
  action: string; // PLACE, MOVE, LEFT, RIGHT

  @CreateDateColumn()
  createdAt: Date;
}
