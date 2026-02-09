import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Robot } from "./pages/robot/robot.component";

@Component({
  imports: [RouterModule, Robot],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'frontend';
}
