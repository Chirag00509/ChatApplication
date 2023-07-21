import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  register(data: any) : Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log(data);


    return this.http.post<any>("https://localhost:7223/api/register", data, { headers: headers })
  }

}
