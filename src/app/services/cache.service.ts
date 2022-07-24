import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Cache {
  powerSaveLevel: number;
  rigExpiry: number | null;
  rigExpiryMinutes: number | null;
  rigOn: boolean | null;
  webcamExpiry: number | null;
  webcamExpiryMinutes: number | null;
  webcamOn: boolean | null;
  webcamRunAtNight: boolean | null;
  webcamTurnOffTime: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  constructor(private http: HttpClient) {}

  getCache() {
    // Note: ios was not doing http gets unless the fully qualified URL was used
    // i.e. http://solar.local/... not http://solar/...
    return this.http.get<Cache>('http://solar.local/api/cache');
  }
}
