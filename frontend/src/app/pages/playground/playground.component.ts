import { Component, HostListener, signal, inject, OnInit, OnDestroy } from "@angular/core";
import { RobotIcon } from "../robot-icon/robot-icon.component";
import { loc } from "../../models/robot.type";
import { RobotService, RobotMovement } from "../../services/robot-data.service";
import { RobotCommandService } from "../../services/robot-command.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

@Component({
    selector: 'app-playground',
    styleUrl: './playground.component.css',
    templateUrl: './playground.component.html',
    imports: [RobotIcon]
})
export class Playground implements OnInit, OnDestroy {
    private readonly ROWS = 5;
    private readonly COLUMNS = 5;
    private readonly DIRECTIONS: Direction[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    private readonly DIRECTION_MAP = {
        NORTH: { dx: 0, dy: 1 },
        EAST: { dx: 1, dy: 0 },
        SOUTH: { dx: 0, dy: -1 },
        WEST: { dx: -1, dy: 0 },
    };

    private robotService = inject(RobotService);
    private commandService = inject(RobotCommandService);
    private destroy$ = new Subject<void>();

    robotPlayground = new Array(this.ROWS).fill(null).map(() => new Array(this.COLUMNS).fill(null));
    newRobotLocation = signal<loc>({ x: 0, y: 0 });
    activeRobotId = signal<number | null>(null);
    robotState = signal<RobotMovement | null>(null);
    reportMessage = signal<string>('');

    ngOnInit() {
        // Restore robot state from database
        this.robotService.fetchReport().subscribe({
            next: (state) => {
                if (state) {
                    this.robotState.set(state);
                    this.activeRobotId.set(0);
                    this.newRobotLocation.set({ x: state.x, y: state.y });
                    this.reportMessage.set(`Restored: X: ${state.x}, Y: ${state.y}, F: ${state.facing}`);
                    console.log('Robot state restored:', state);
                }
            },
            error: () => {
                console.log('No saved robot state');
            }
        });

        // Subscribe to move commands from button
        this.commandService.moveCommand$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.move());

        // Subscribe to left turn commands from button
        this.commandService.leftCommand$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.turnLeft());

        // Subscribe to right turn commands from button
        this.commandService.rightCommand$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.turnRight());

        // Subscribe to report commands from button
        this.commandService.reportCommand$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.report());
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent) {
        const table = document.querySelector('.l-robot-table');
        if (table && table.contains(event.target as Node)) {
            const rect = (table as HTMLElement).getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            // Convert pixel coordinates to grid coordinates (0,0 at bottom-left)
            const cellSize = rect.width / this.COLUMNS;
            const gridX = Math.floor(clickX / cellSize);
            const gridY = this.ROWS - 1 - Math.floor(clickY / cellSize);

            // Validate bounds
            if (gridX < 0 || gridX >= this.COLUMNS || gridY < 0 || gridY >= this.ROWS) {
                console.log('Click outside table bounds, ignoring');
                return;
            }

            // Update local state immediately
            this.robotState.set({ x: gridX, y: gridY, facing: 'NORTH' });
            this.activeRobotId.set(0);
            this.newRobotLocation.set({ x: gridX, y: gridY });
            this.reportMessage.set(`Robot placed at (${gridX}, ${gridY}) facing NORTH`);

            // Sync to database
            this.robotService.sendRobotMovements({
                x: gridX,
                y: gridY,
                facing: 'NORTH'
            }).subscribe({
                next: () => {
                    console.log('Robot position saved:', { x: gridX, y: gridY });
                },
                error: () => {
                    console.error('Failed to save robot position');
                }
            });
        }
    }

    @HostListener('window:keydown', ['$event'])
    handleKeypress(event: KeyboardEvent) {
        if (!this.robotState()) {
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.move();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.turnLeft();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.turnRight();
                break;
            case ' ':
                event.preventDefault();
                this.report();
                break;
        }
    }

    move() {
        const state = this.robotState();
        if (!state) return;

        const direction = state.facing;
        const delta = this.DIRECTION_MAP[direction];
        const newX = state.x + delta.dx;
        const newY = state.y + delta.dy;

        // Validate bounds
        if (newX < 0 || newX >= this.COLUMNS || newY < 0 || newY >= this.ROWS) {
            console.log('Move would go off table, ignoring');
            return;
        }

        // Update local state
        const newState = { ...state, x: newX, y: newY };
        this.robotState.set(newState);
        this.newRobotLocation.set({ x: newX, y: newY });
        this.reportMessage.set(`Moved to (${newX}, ${newY})`);

        // Sync to database
        this.robotService.sendRobotMovements(newState).subscribe({
            next: () => {
                console.log('Position saved');
            },
            error: () => {
                console.error('Failed to save position');
            }
        });
    }

    turnLeft() {
        const state = this.robotState();
        if (!state) return;

        const currentIndex = this.DIRECTIONS.indexOf(state.facing);
        const newIndex = (currentIndex - 1 + this.DIRECTIONS.length) % this.DIRECTIONS.length;
        const newFacing = this.DIRECTIONS[newIndex];

        // Update local state
        const newState = { ...state, facing: newFacing };
        this.robotState.set(newState);
        this.reportMessage.set(`Turned left, now facing ${newFacing}`);

        // Sync to database
        this.robotService.sendRobotMovements(newState).subscribe({
            next: () => {
                console.log('Position saved');
            },
            error: () => {
                console.error('Failed to save position');
            }
        });
    }

    turnRight() {
        const state = this.robotState();
        if (!state) return;

        const currentIndex = this.DIRECTIONS.indexOf(state.facing);
        const newIndex = (currentIndex + 1) % this.DIRECTIONS.length;
        const newFacing = this.DIRECTIONS[newIndex];

        // Update local state
        const newState = { ...state, facing: newFacing };
        this.robotState.set(newState);
        this.reportMessage.set(`Turned right, now facing ${newFacing}`);

        // Sync to database
        this.robotService.sendRobotMovements(newState).subscribe({
            next: () => {
                console.log('Position saved');
            },
            error: () => {
                console.error('Failed to save position');
            }
        });
    }

    report() {
        const state = this.robotState();
        if (!state) return;

        const facingMap: { [key: string]: string } = {
            NORTH: '↑',
            EAST: '→',
            SOUTH: '↓',
            WEST: '←'
        };
        this.reportMessage.set(
            `X: ${state.x}, Y: ${state.y}, F: ${state.facing} ${facingMap[state.facing]}`
        );
    }
}
