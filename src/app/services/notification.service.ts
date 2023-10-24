import {Injectable} from "@angular/core";
import {NotifierService} from "angular-notifier";

@Injectable({providedIn: 'root'})
export class NotificationService {
  private readonly notifier:NotifierService;

  constructor(notificationService: NotifierService) {
    this.notifier = notificationService;
  }

  onDefault(message: string){
    this.notifier.notify(type.DEFAULT, message);
  }

  onInfo(message: string){
    this.notifier.notify(type.INFO, message);
  }

  onWarning(message: string){
    this.notifier.notify(type.WARNING, message);
  }

  onSuccess(message: string){
    this.notifier.notify(type.SUCCESS, message);
  }

  onError(message: string){
    this.notifier.notify(type.ERROR, message);
  }
}
enum type{
  DEFAULT= 'default', INFO = 'info', WARNING='warning', SUCCESS = 'success', ERROR = 'error'
}
