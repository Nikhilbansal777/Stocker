import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StockService } from './stock.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.shouldFetchData();
    this.tickers.forEach((ticker) => {
      this.getRealTimeStockPrice(ticker);
    });
  }

  ngOnDestroy() {
    this.clearAllIntervals();
  }

  private shouldFetchData(): boolean {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    console.log(now, day, hour, minutes);
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
      const priceElement = doc.querySelector('.YMlKec.fxKbKc');
      if (priceElement) {
        this.prices[stockTicker] = parseFloat(
          priceElement.textContent!.replace('₹', '').replace(',', '')
        );
        console.log(`Price for ${stockTicker}:`, this.prices[stockTicker]);
      }
    });
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
