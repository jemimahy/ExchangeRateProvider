import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExchangeService } from '../../services/exchange';

export interface ExchangeRate {
  country: string;
  currency: string;
  amount: number;
  currencyCode: string;
  rate: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private exchangeService = inject(ExchangeService);

  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  rates = signal<ExchangeRate[]>([]);
  inputAmount = signal<number>(100);
  
  sourceCurrency = signal<ExchangeRate | null>(null);
  targetCurrency = signal<ExchangeRate | null>(null);

  convertedResult = computed(() => {
    const src = this.sourceCurrency();
    const tgt = this.targetCurrency();
    const val = this.inputAmount();

    if (!src || !tgt || src.rate === 0 || tgt.rate === 0) return 0;

    const amountInCzk = (val * src.rate) / src.amount;
    return (amountInCzk / tgt.rate) * tgt.amount;
  });

  //pin the selected currency to the top of the list
  sortedRates = computed(() => {
    const list = this.rates();
    const selected = this.targetCurrency();

    if (!selected) return list;
    const otherRates = list.filter(r => r.currencyCode !== selected.currencyCode);
    return [selected, ...otherRates];
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.exchangeService.getRates().subscribe({
      next: (data: ExchangeRate[]) => {

        const czkEntry: ExchangeRate = {
          country: 'Czech Republic',
          currency: 'Koruna',
          amount: 1,
          currencyCode: 'CZK',
          rate: 1
        };

        const fullList = [czkEntry, ...data];
        this.rates.set(fullList);
        
        //default is czk to usd
        this.sourceCurrency.set(czkEntry);
        const usd = fullList.find(r => r.currencyCode === 'USD');
        this.targetCurrency.set(usd || fullList[1]);

        this.isLoading.set(false);
      },
      //error message
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading.set(false);
        
        if (err.status === 0) {
          this.errorMessage.set('Cannot connect to the backend. Please ensure the .NET server is running.');
        } else {
          this.errorMessage.set('Failed to load exchange rates from CNB. Please try again later.');
        }
      }
    });
  }

  //validation to prevent negative numbers
  onAmountChange(value: number): void {
    this.inputAmount.set(value < 0 ? 0 : value);
  }
  //restrict letter "e" in number input
  preventEInput(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === 'e') {
      event.preventDefault();
    }
  }

  //for swap button
  swapCurrencies(): void {
    const currentSource = this.sourceCurrency();
    const currentTarget = this.targetCurrency();

    this.sourceCurrency.set(currentTarget);
    this.targetCurrency.set(currentSource);
  }
}