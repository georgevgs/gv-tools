import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { DarkModeService } from 'angular-dark-mode';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.css']
})
export class DarkModeToggleComponent {

  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;

  constructor(private darkModeService: DarkModeService) { }
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  onToggle(): void {
    this.darkModeService.toggle();
  }

}
