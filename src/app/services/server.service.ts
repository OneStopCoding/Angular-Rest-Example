import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, tap} from "rxjs";
import {CustomResponse} from "../interfaces/customResponse";
import {Server} from "../interfaces/server";
import {Status} from "../enums/status.enum";
import {DataState} from "../enums/data.state.enum";

@Injectable({providedIn: 'root'})
export class ServerService {
  private readonly apiUri = 'http://localhost:8080/servers/';

  constructor(private http: HttpClient) {
  }

  servers$ = <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUri}list`)
      .pipe(
        tap(console.log),
        catchError(err => {
          console.log(err);
          throw new Error("Method not implemented")
        }));

  save$ = (server: Server) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUri}save`, server)
      .pipe(
        tap(console.log),
        catchError(err => {
          console.log(err);
          throw new Error("Method not implemented")
        }));

  ping$ = (ip: string) => <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUri}ping/${ip}`)
      .pipe(
        tap(console.log),
        catchError(err => {
          console.log(err);
          throw new Error("Method not implemented")
        }));

  filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
      subscriber => {

        subscriber.next(status === Status.ALL ? {...response, message: `servers filtered by ${status}`} :
          {
            ...response, message: response.data.Servers.filter(server => server.status === status).length > 0 ?
              `servers filtered by ${status}` : 'No servers with status ${status} found.',
            data: {Servers: response.data.Servers.filter(server => server.status === status)}
          })
        subscriber.complete();
      }
    ).pipe(
      tap(console.log),
      catchError(err => {
        console.log(err);
        throw new Error("Method not implemented")
      }));

  delete$ = (serverId: number) => <Observable<CustomResponse>>
    this.http.delete<CustomResponse>(`${this.apiUri}delete/${serverId}`)
      .pipe(
        tap(console.log),
        catchError(err => {
          console.log(err);
          throw new Error("Method not implemented")
        }));
}
