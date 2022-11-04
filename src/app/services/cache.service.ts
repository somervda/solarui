import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
    return this.http.get<Cache>(
      'http://' + environment.solarHost + '/api/cache'
    );
  }

  // Settings update routines

  powerSaveLevel(value: number) {
    // console.log('cacheService:powerSaveLevel', value);
    return this.http.get<Cache>(
      'http://' +
        environment.solarHost +
        '/api/cache/powerSaveLevel/' +
        value.toString()
    );
  }

  webcamExpiryMinutes(value: number) {
    // console.log('cacheService:webcamExpiryMinutes', value);
    return this.http.get<Cache>(
      'http://' +
        environment.solarHost +
        '/api/cache/webcamExpiryMinutes/' +
        value.toString()
    );
  }

  rigExpiryMinutes(value: number) {
    // console.log('cacheService:rigExpiryMinutes', value);
    return this.http.get<Cache>(
      'http://' +
        environment.solarHost +
        '/api/cache/rigExpiryMinutes/' +
        value.toString()
    );
  }

  webcamRunAtNight(value: boolean) {
    // console.log('cacheService:webcamRunAtNight', value);
    return this.http.get<Cache>(
      'http://' +
        environment.solarHost +
        '/api/cache/webcamRunAtNight/' +
        (value == false ? 'False' : 'True')
    );
  }

  webcamTurnOffTime(value: string) {
    // console.log('cacheService:webcamTurnOffTime', value);
    return this.http.get<Cache>(
      'http://' +
        environment.solarHost +
        '/api/cache/webcamTurnOffTime/' +
        value
    );
  }
}
