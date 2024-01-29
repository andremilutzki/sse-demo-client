import {
  Component,
  OnInit
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {AppService} from './services/app.service';
import {HttpClientModule} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faShieldCat
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, FontAwesomeModule],
  providers: [AppService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private appService: AppService) {
  }

  exportInProgress: boolean = false;

  updatesReceived: boolean = false;

  loadingIcon = faShieldCat;

  ngOnInit(): void {
    this.getStatusUpdates();
  }

  handleClick() {
    this.exportInProgress = true;
    this.appService.createExport();
    this.getStatusUpdatesAfterFiveSeconds();
  }

  private getStatusUpdates() {
    this.appService.getServerSentEvent().subscribe((exportInProgress: boolean) => {
      this.exportInProgress = exportInProgress
      this.updatesReceived = true;
    });
  }


  private getStatusUpdatesAfterFiveSeconds() {
    setTimeout(() => this.getStatusUpdates(), 2000);
  }
}
