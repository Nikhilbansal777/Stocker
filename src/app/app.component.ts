import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StockService } from './stock.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StockService],
})
export class AppComponent implements OnInit {
  price: number | null = null;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.getRealTimeStockPrice('INFY')
  }

  getTicker(stockTicker: string) {
    console.log(stockTicker);
    this.getRealTimeStockPrice(stockTicker)

  }

  getRealTimeStockPrice(stockTicker: string){
    this.stockService.fetchStockData(stockTicker).subscribe((response) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response, 'text/html');
      const priceElement = doc.querySelector('.YMlKec.fxKbKc');
      if (priceElement) {
        this.price = parseFloat(
          priceElement.textContent!.replace('₹', '').replace(',', '')
        );
      }
    });
  }
}
