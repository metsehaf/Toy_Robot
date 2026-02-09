import { Controller, Post, Get, Body } from '@nestjs/common';
import { RobotService, RobotState } from './robot.service';

@Controller('robot')
export class RobotController {
  constructor(private robotService: RobotService) {}

  /**
   * Save robot position to database
   * Called after every movement (PLACE, MOVE, LEFT, RIGHT)
   */
  @Post('position')
  async savePosition(@Body() body: RobotState): Promise<RobotState> {
    return this.robotService.savePosition(body);
  }

  /**
   * Get current robot state from database
   */
  @Get('report')
  async report(): Promise<RobotState | null> {
    return this.robotService.getReport();
  }

  /**
   * Get movement history
   */
  @Get('history')
  async getHistory() {
    return this.robotService.getHistory();
  }
}
