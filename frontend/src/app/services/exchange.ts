import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class ExchangeService {
  private http = inject(HttpClient);
  
  private apiUrl = environment.apiUrl; 

  getRates() {
    return this.http.get<any[]>(this.apiUrl);
  }
}