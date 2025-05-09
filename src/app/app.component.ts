import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StockService } from './stock.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SwPush, SwUpdate } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StockService],
})
export class AppComponent implements OnInit, OnDestroy {
  public prices: { [key: string]: number | null } = {};
  public previousClose: { [key: string]: number | null } = {};
  public revenue: { [key: string]: number | null } = {};
  private intervalIds: { [key: string]: any } = {};
  public tickers = [
    'KPITTECH',
    'NAUKRI',
    'CAMS',
    'BHARTIHEXA',
    'BHARTIARTL',
    'HAPPSTMNDS',
    'HAL',
    'TATAELXSI',
    'TATAINVEST',
    'DOMS',
    'SONACOMS',
    'GODIGIT',
    'SWIGGY',
    'VBL',
    'IXIGO',
    'ZOMATO',
    'OLECTRA',
    'TORENTPOWER',
    'HYUNDAI',
    'RPOWER',
    'PETRONET',
    'INFY',
    'VEDL',
    'IRCTC',
    'INOXINDIA',
    'EXIDEIND',
    'CGPOWER',
    'CANBK',
    'BAJAJHFL',
    'TATAPOWER',
    'TATAMOTORS',
    'VBL',
    'ITC',
    'BAJAJ-AUTO',
    'JIOFIN',
    'TATASTEEL',
  ];

  constructor(
    private stockService: StockService,
    private swPush: SwPush,
    private swUpdate: SwUpdate
  ) {}

  ngOnInit() {
    this.shouldFetchData();
    this.tickers.forEach((ticker) => {
      this.getRealTimeStockPrice(ticker);
    });

    this.swPush.messages.subscribe((mess) => console.log(mess));
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      window.open(notification.data.url);
    });
    // this.http.get('https://www.google.com/finance/quote/INFY:NSE').subscribe((res)=>{
    //   console.log(res);

    // })
    console.log('hi');
    this.pushSubscription();
  }

  public VAPID_PUBLIC_KEY =
    'BIwHKMzF6gMtT89NlBq2mThi5G29Sxlge4jLFVZWJUx2dNOUQ6kL_0t3cmGC7S6rlDrEjQFvkyIX_PnBLXNEMEI';

  pushSubscription() {
    console.log(this.swPush.isEnabled);
    if (!this.swPush.isEnabled) {
      console.log('notfiication enabled');
      return;
    } else {
      console.log('not enabled');
    }
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((re) => {
        console.log(re, 'hi');
      })
      .catch((er) => console.log(er));
  }

  subs() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((re) => {
        console.log(re);
      })
      .catch((er) => console.log(er));
  }
  ngOnDestroy() {
    this.clearAllIntervals();
  }

  private shouldFetchData(): boolean {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    if (day === 0 || day === 6) {
      return false;
    }
    if (hour > 15 || (hour === 15 && minutes > 30)) {
      return false;
    }

    return true;
  }

  private fetchStockPrice(stockTicker: string) {
    this.stockService.fetchStockData(stockTicker).subscribe((response) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response, 'text/html');
      // console.log(doc)
      const priceElement = doc.querySelector('.YMlKec.fxKbKc');
      const previousClose = doc.querySelector('.P6K39c');
      const revenue = doc.querySelector('.P6K39c');
      // console.log(previousClose)
      if (priceElement && previousClose) {
        this.prices[stockTicker] = this.formatData(priceElement);
        this.previousClose[stockTicker] = this.formatData(previousClose);
        this.revenue[stockTicker] = this.formatData(revenue);
      }
    });
  }

  formatData(val: any) {
    return parseFloat(val.textContent!.replace('₹', '').replace(',', ''));
  }

  getRealTimeStockPrice(stockTicker: string) {
    if (this.shouldFetchData()) {
      this.fetchStockPrice(stockTicker);
    }
    this.intervalIds[stockTicker] = setInterval(() => {
      if (this.shouldFetchData()) {
        this.fetchStockPrice(stockTicker);
      }
    }, 5000);

    const now = new Date();
    const finalFetchTime = new Date();
    finalFetchTime.setHours(15, 30, 0, 0);
    if (now > finalFetchTime) {
      setTimeout(() => {
        this.fetchStockPrice(stockTicker);
      }, 5000);
    }
  }

  private clearAllIntervals() {
    for (const ticker in this.intervalIds) {
      if (this.intervalIds[ticker]) {
        clearInterval(this.intervalIds[ticker]);
        delete this.intervalIds[ticker];
      }
    }
  }
}
