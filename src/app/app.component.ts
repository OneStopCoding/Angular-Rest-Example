import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {CustomResponse} from "./interfaces/customResponse";
import {AppState} from "./interfaces/app.state";
import {ServerService} from "./services/server.service";
import {DataState} from "./enums/data.state.enum";
import {Status} from "./enums/status.enum";
import {Server} from "./interfaces/server";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PopupComponent} from "./component/popup/popup.component";
import {NotificationService} from "./services/notification.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    appState$: Observable<AppState<CustomResponse>>;
    readonly DataState = DataState;
    readonly Status = Status;
    private filterSubject = new BehaviorSubject<String>('');
    filterStatus$ = this.filterSubject.asObservable();
    private dataSubject = new BehaviorSubject<CustomResponse>(null);

    constructor(private serverService: ServerService, private dialog: MatDialog, private notifier: NotificationService) {
    }

     ngOnInit(): void {
        this.appState$ = this.serverService.servers$
            .pipe(
                map(response => {
                    this.dataSubject.next(response);
                    return {dataState: DataState.LOADED, appData: response}
                }),
                startWith({dataState: DataState.LOADING}),
                catchError((err: string) => {
                    return of({dataState: DataState.ERROR, error: err})
                })
            )
    }

    ping(ipAddress: string): void {
        this.filterSubject.next(ipAddress);
        this.appState$ = this.serverService.ping$(ipAddress)
            .pipe(
                map(response => {
                    this.dataSubject.value.data.Servers[this.dataSubject.value.data.Servers.findIndex(
                        server => server.id === response.data.Server.id
                    )] = response.data.Server;
                    this.filterSubject.next("");
                    response.message === 'Ping Successful' ? this.notifier.onSuccess(response.message) :
                        this.notifier.onWarning(response.message);
                    return {dataState: DataState.LOADED, appData: this.dataSubject.value}
                }),
                startWith({dataState: DataState.LOADED, appData: this.dataSubject.value}),
                catchError((err: string) => {
                    this.notifier.onError('Ping Failed');
                    this.filterSubject.next("");
                    return of({dataState: DataState.ERROR, error: err})
                })
            )
    }

    filter(status: Status): void {
        this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
            .pipe(
                map(response => {
                    this.notifier.onInfo('Filtered by ' + status);
                    return {dataState: DataState.LOADED, appData: response}
                }),
                startWith({dataState: DataState.LOADED, appData: this.dataSubject.value}),
                catchError((err: string) => {
                    this.notifier.onError('Failed to filter')
                    this.filterSubject.next("");
                    return of({dataState: DataState.ERROR, error: err})
                })
            )
    }


    delete(server: Server): void {
        this.appState$ = this.serverService.delete$(server.id)
            .pipe(
                map(response => {
                    this.notifier.onSuccess('Server with ip: ' + server.ipAddress + ' deleted')
                    this.dataSubject.next({...response, data: {Servers: this.dataSubject.value.data.Servers.filter(s => s.id !== server.id)}})
                    return {dataState: DataState.LOADED, appData: this.dataSubject.value}
                }),
                startWith({dataState: DataState.LOADED, appData: this.dataSubject.value}),
                catchError((err: string) => {
                    this.notifier.onError('Failed to delete server with ip: ' + server.ipAddress)
                    this.filterSubject.next("");
                    return of({dataState: DataState.ERROR, error: err})
                })
            )
    }

    printReport(type: string) {
        if (type.toLowerCase() === 'excel') {
            this.notifier.onInfo('Excel Downloaded')
            let dataType = "application/vnd.ms-excel.sheet.macroEnabled.12";
            let tableSelect = document.getElementById('servers');
            let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
            let downloadLink = document.createElement('a');
            document.body.appendChild(downloadLink);
            downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
            downloadLink.download = 'server-report.xls';
            downloadLink.click();
            document.removeChild(downloadLink);
        } else if (type.toLowerCase() === 'pdf') {
            window.print();
            this.notifier.onInfo('PDF Saved')
        }
    }

    openDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = {
            left: '20%'
        };
        dialogConfig.width = '60%';
        dialogConfig.height = '400px';
        dialogConfig.autoFocus = false;
        this.dialog.open(PopupComponent, dialogConfig)
    }
}


