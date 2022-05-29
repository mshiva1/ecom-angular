import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  notify(msg: string, type: string, delay: number, id: string): void {
    this.notifier.notify(type, msg, id)
  }
  constructor(private notifier: NotifierService) {
  }
}
