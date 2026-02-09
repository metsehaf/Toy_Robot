import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot, RobotHistory, Direction } from './robot.entity';

export interface RobotState {
  x: number;
  y: number;
  facing: Direction;
}

@Injectable()
export class RobotService {
  private readonly TABLE_SIZE = 5;

  constructor(
    @InjectRepository(Robot)
    private robotRepo: Repository<Robot>,
    @InjectRepository(RobotHistory)
    private historyRepo: Repository<RobotHistory>,
  ) {}

  /**
   * Save robot position to database and log to history
   * Frontend handles validation and movement logic
   */
  async savePosition(state: RobotState): Promise<RobotState> {
    // Validate bounds (safety check)
    if (
      state.x < 0 ||
      state.x >= this.TABLE_SIZE ||
      state.y < 0 ||
      state.y >= this.TABLE_SIZE
    ) {
      throw new Error('Invalid position: out of table bounds');
    }

    // Save to robot table
    await this.robotRepo.save({
      id: 1,
      x: state.x,
      y: state.y,
      facing: state.facing,
    });

    // Save to history table
    await this.historyRepo.save({
      robotId: 1,
      x: state.x,
      y: state.y,
      facing: state.facing,
      action: 'MOVE', // All frontend movements use this
    });

    return state;
  }

  /**
   * Get current robot state from database
   * Returns null if no robot has been placed
   */
  async getReport(): Promise<RobotState | null> {
    const robot = await this.robotRepo.findOne({ where: { id: 1 } });
    if (!robot) {
      return null;
    }
    return {
      x: robot.x,
      y: robot.y,
      facing: robot.facing,
    };
  }

  /**
   * Get movement history from database
   */
  async getHistory() {
    return this.historyRepo.find({
      where: { robotId: 1 },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
