import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RigService {
  constructor(private http: HttpClient) {}

  rigOn() {
    // console.log('Rig service on', environment.solarURL + '/api/rig/on');
    return this.http.get<string>(environment.solarURL + '/api/rig/on');
  }
  rigOff() {
    // console.log('Rig service off', environment.solarURL + '/api/rig/off');
    return this.http.get<string>(environment.solarURL + '/api/rig/off');
  }
}
