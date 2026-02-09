import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RobotCommandService {
  // Create subjects for each command
  private moveCommandSubject = new Subject<void>();
  private leftCommandSubject = new Subject<void>();
  private rightCommandSubject = new Subject<void>();
  private reportCommandSubject = new Subject<void>();

  // Expose as observables
  moveCommand$ = this.moveCommandSubject.asObservable();
  leftCommand$ = this.leftCommandSubject.asObservable();
  rightCommand$ = this.rightCommandSubject.asObservable();
  reportCommand$ = this.reportCommandSubject.asObservable();

  // Methods to emit commands
  emitMove() {
    this.moveCommandSubject.next();
  }

  emitLeft() {
    this.leftCommandSubject.next();
  }

  emitRight() {
    this.rightCommandSubject.next();
  }

  emitReport() {
    this.reportCommandSubject.next();
  }
}
