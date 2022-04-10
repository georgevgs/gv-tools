import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gv-tools';

  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
