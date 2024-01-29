import {
  Injectable,
  NgZone
} from '@angular/core';
import {SseService} from './sse.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private zone: NgZone, private sseService: SseService, private http: HttpClient) {
  }

  createExport(): void {
    this.http.post('http://localhost:8080/exports', {}).subscribe();
  }

  getServerSentEvent(): Observable<boolean> {
    const eventSource = this.sseService.getEventSource('http://localhost:8080/stream-events');

    return new Observable(observer => {

      eventSource.addEventListener('EXPORT_DONE', event => {
        this.zone.run(() => {
          // Return whether export is still in progress
          observer.next(false);
          eventSource.close();
          console.log('Export is done!!!');
        });
      });

      eventSource.addEventListener('NO_EXPORT_STARTED_YET', event => {
        this.zone.run(() => {
          // Return whether export is still in progress
          observer.next(false);
          eventSource.close();
        });
      });

      eventSource.addEventListener('EXPORT_IN_PROGRESS', event => {
        this.zone.run(() => {
          // Return if whether is still in progress
          observer.next(true);
          console.log('Export is in progress!!!');
        });
      });

      eventSource.onerror = () => {
        this.zone.run(error => {
          if (error != undefined) {
            console.log(error);
          }
          eventSource.close();
        });
      };
    });
  }
}
