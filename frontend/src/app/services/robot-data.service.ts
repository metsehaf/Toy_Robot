import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, catchError, of } from "rxjs";

export interface RobotMovement {
  x: number;
  y: number;
  facing: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
}

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class RobotService {
  private http = inject(HttpClient);

  /**
   * Fetch current robot state from database
   * Returns null if no robot has been placed yet
   */
  fetchReport(): Observable<RobotMovement | null> {
    return this.http.get<RobotMovement>(`${API_URL}/robot/report`).pipe(
      catchError((err) => {
        console.log('No saved robot state');
        return of(null);
      })
    );
  }

  /**
   * Save robot position to database and update history
   * Called after every movement (PLACE, MOVE, LEFT, RIGHT)
   */
  sendRobotMovements(movement: RobotMovement): Observable<RobotMovement> {
    return this.http.post<RobotMovement>(`${API_URL}/robot/position`, movement).pipe(
      catchError((err) => {
        console.error('Failed to save robot movement:', err);
        throw err;
      })
    );
  }

  /**
   * Get movement history from database
   */
  getHistory(): Observable<any> {
    return this.http.get(`${API_URL}/robot/history`).pipe(
      catchError((err) => {
        console.error('Failed to fetch history:', err);
        throw err;
      })
    );
  }
}