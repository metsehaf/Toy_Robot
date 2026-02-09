import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotController } from './robot.controller';
import { RobotService } from './robot.service';
import { Robot, RobotHistory } from './robot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Robot, RobotHistory])],
  controllers: [RobotController],
  providers: [RobotService],
})
export class RobotModule {}
