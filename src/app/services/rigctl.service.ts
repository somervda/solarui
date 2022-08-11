import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RigctlService {
  constructor(private http: HttpClient) {}

  rigctl(operation: string) {
    return this.http.get(environment.solarURL + '/api/rigctl/' + operation, {
      responseType: 'text',
    });
  }
}
