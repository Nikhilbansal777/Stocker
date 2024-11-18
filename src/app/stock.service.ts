import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private ticker = 'INFY'; // Replace with desired ticker
  private exchange = 'NSE'; // NSE or BSE
  private baseUrl = `https://www.google.com/finance/quote`;

  constructor(private http: HttpClient) {}

  fetchStockData(stockTicker: string): Observable<string> {
    return this.http.get(`http://localhost:3000/fetch-stock/${stockTicker}`, { responseType: 'text' });
  }
}
