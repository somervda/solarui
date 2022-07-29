import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebcamService {
  constructor(private http: HttpClient) {}

  webcamOn() {
    return this.http.get<string>(environment.solarURL + '/api/webcam/on');
  }
  webcamOff() {
    // Not used?
    return this.http.get<string>(environment.solarURL + '/api/webcam/off');
  }
}
