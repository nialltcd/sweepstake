import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private dataUrl = 'https://raw.githubusercontent.com/lsv/uefa-euro-2020/master/data.json';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  getEuroData(): Observable<any[]>
  {
    return this.http.get<any[]>(this.dataUrl)
  }
}
