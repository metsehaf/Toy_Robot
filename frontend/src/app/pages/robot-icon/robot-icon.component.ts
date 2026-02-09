import { Component, effect, inject, input, signal, viewChild, viewChildren, computed } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CdkDrag, CdkDragEnd, CdkDragStart, } from '@angular/cdk/drag-drop';
import { loc } from "../../models/robot.type";

@Component({
    selector: 'app-robot-icon',
    templateUrl: './robot-icon.component.html',
    styleUrls: ['./robot-icon.component.css'],
})
export class RobotIcon {
    readonly draggables = viewChildren(CdkDrag);
    newRobotLocation = input.required<loc>();
    activeRobotId = input<number | null>(0);
    robotFacing = input<'NORTH' | 'EAST' | 'SOUTH' | 'WEST'>('NORTH');
    private sanitizer = inject(DomSanitizer);
    
    private readonly GRID_SIZE = 500; // pixels
    private readonly GRID_CELLS = 5;
    private readonly CELL_SIZE = this.GRID_SIZE / this.GRID_CELLS; // 100px per cell
    
    private readonly robotSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f" class="l-robot-icon-svg">
            <path d="M160-120v-200q0-33 23.5-56.5T240-400h480q33 0 56.5 23.5T800-320v200H160Zm200-320q-83 0-141.5-58.5T160-640q0-83 58.5-141.5T360-840h240q83 0 141.5 58.5T800-640q0 83-58.5 141.5T600-440H360ZM240-200h480v-120H240v120Zm120-320h240q50 0 85-35t35-85q0-50-35-85t-85-35H360q-50 0-85 35t-35 85q0 50 35 85t85 35Zm28.5-91.5Q400-623 400-640t-11.5-28.5Q377-680 360-680t-28.5 11.5Q320-657 320-640t11.5 28.5Q343-600 360-600t28.5-11.5Zm240 0Q640-623 640-640t-11.5-28.5Q617-680 600-680t-28.5 11.5Q560-657 560-640t11.5 28.5Q583-600 600-600t28.5-11.5ZM480-200Zm0-440Z"/>
        </svg>`;
    private readonly downArrow = `<svg class="l-robot-icon-svg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>`;
    private readonly upArrow = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>`;
    private readonly leftArrow = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>`;
    private readonly rightArrow = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>`;
    
    robotIcon = [
        {
            id: 0,
            icon: this.sanitizer.bypassSecurityTrustHtml(this.robotSvg),
            arrow: this.sanitizer.bypassSecurityTrustHtml(this.upArrow)
        },
        {
            id: 1,
            icon: this.sanitizer.bypassSecurityTrustHtml(this.robotSvg),
            arrow: this.sanitizer.bypassSecurityTrustHtml(this.downArrow)
        },
        {
            id: 2,
            icon: this.sanitizer.bypassSecurityTrustHtml(this.robotSvg),
            arrow: this.sanitizer.bypassSecurityTrustHtml(this.leftArrow)
        },
        {
            id: 3,
            icon: this.sanitizer.bypassSecurityTrustHtml(this.robotSvg),
            arrow: this.sanitizer.bypassSecurityTrustHtml(this.rightArrow)
        }
    ];

    robotState = signal(this.robotIcon.map(r => ({ ...r, position: { x: 0, y: 0 } })));
    
    // Compute pixel position from grid coordinates
    pixelPosition = computed(() => {
        const loc = this.newRobotLocation();
        const iconId = this.activeRobotId();
        
        if (iconId === null) {
            return { x: -1000, y: -1000 }; // Off screen if no active robot
        }
        
        // Convert grid coordinates (0-4) to pixel coordinates (0-500)
        // Grid Y is inverted: 0 is at bottom, 4 is at top
        // Pixel Y: 0 is at top, 500 is at bottom
        const pixelX = loc.x * this.CELL_SIZE;
        const pixelY = (this.GRID_CELLS - 1 - loc.y) * this.CELL_SIZE;
        
        return { x: pixelX, y: pixelY };
    });

    onDragStarted(e: CdkDragStart) {
        console.log('drag started', !!document.querySelector('#robot-playground'), document.querySelector('#robot-playground'));
    }
    
    onDragEnded(e: CdkDragEnd) {
        console.log('drag ended', !!document.querySelector('#robot-playground'), document.querySelector('#robot-playground'));
        console.log('drag ended', e);
    }
    
    getArrowForDirection() {
        const direction = this.robotFacing();
        const arrowMap: { [key: string]: string } = {
            NORTH: this.upArrow,
            EAST: this.rightArrow,
            SOUTH: this.downArrow,
            WEST: this.leftArrow
        };
        return this.sanitizer.bypassSecurityTrustHtml(arrowMap[direction]);
    }
}