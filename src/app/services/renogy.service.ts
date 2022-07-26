import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface RenogyStatus {
  batteryCapacity: number;
  batteryVoltage: number;
  chargingMode: number;
  chargingModeDesc: string;
  outputCurrent: number;
  outputPower: number;
  outputVoltage: number;
  solarAmps: number;
  solarPower: number;
  solarVolts: number;
}

export interface RenogyHistory {
  epochTime: number;
  batteryCapacity: number;
  solarPower: number;
  outputPower: number;
}

@Injectable({
  providedIn: 'root',
})
export class RenogyService {
  constructor(private http: HttpClient) {}

  getStatus() {
    // Note: ios was not doing http gets unless the fully qualified URL was used
    return this.http.get<RenogyStatus>(
      environment.solarURL + '/api/renogystatus'
    );
  }

  getHistory(days: number) {
    console.log('getHistory ', days);
    let start = new Date().getTime() / 1000;
    start -= 60 * 60 * 24 * days;
    start = Math.round(start);
    return this.http.get<[[RenogyHistory]]>(
      environment.solarURL + '/api/renogyhistory/' + start
    );
  }
}
