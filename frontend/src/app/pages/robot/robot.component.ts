import { Component, inject } from "@angular/core";
import { RobotCommandService } from "../../services/robot-command.service";
import { Playground } from "../playground/playground.component";

@Component({
    selector: 'app-robot',
    templateUrl: './robot.component.html',
    styleUrl: './robot.component.css',
    imports: [Playground]
})
export class Robot {
    private commandService = inject(RobotCommandService);

    left() {
        this.commandService.emitLeft();
    }

    move() {
        this.commandService.emitMove();
    }

    right() {
        this.commandService.emitRight();
    }

    report() {
        this.commandService.emitReport();
    }
}