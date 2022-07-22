import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
export class RenogyService {
  constructor(private http: HttpClient) {}

  getStatus() {
    return this.http.get<RenogyStatus>('http://solar/api/renogystatus');
  }
}
