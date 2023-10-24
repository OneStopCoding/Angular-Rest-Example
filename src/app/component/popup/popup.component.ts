import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Server} from "../../interfaces/server";
import {BehaviorSubject, catchError, map, Observable, of, startWith, Subscription} from "rxjs";
import {CustomResponse} from "../../interfaces/customResponse";
import {ServerService} from "../../services/server.service";
import {Status} from 'src/app/enums/status.enum';
import {DataState} from 'src/app/enums/data.state.enum';
import {MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../services/notification.service";

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css']
})
export class PopupComponent {
    isLoading = new BehaviorSubject<Boolean>(false);
    isLoading$ = this.isLoading.asObservable();
    appState$: Subscription;
    readonly Status = Status;
    dataSubject = new BehaviorSubject<CustomResponse>(null);

    constructor(private serverService: ServerService, private notifier: NotificationService) {
    }

    saveServer(serverForm: NgForm) {
        this.appState$ = this.serverService.save$(serverForm.value as Server).subscribe(() => {
            this.isLoading.next(true);
            window.location.reload()
        });
        this.notifier.onSuccess('Server added');
        startWith({dataState: DataState.LOADING})
        catchError((err: string) => {
            this.notifier.onError('Failed to add server')
            this.isLoading.next(false);
            return of({dataState: DataState.ERROR, error: err})
        })
        this.isLoading.next(false);
    }
}
