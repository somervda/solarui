import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface MumbleState {
  mumbleState: string;
}

@Injectable({
  providedIn: 'root',
})
export class RigService {
  constructor(private http: HttpClient) {}

  rigOn() {
    // console.log('Rig service on', environment.solarURL + '/api/rig/on');
    return this.http.get<string>(
      'http://' + environment.solarHost + '/api/rig/on'
    );
  }

  rigOff() {
    // console.log('Rig service off', environment.solarURL + '/api/rig/off');
    return this.http.get<string>(
      'http://' + environment.solarHost + '/api/rig/off'
    );
  }

  mumbleOn() {
    return this.http.get<string>(
      'http://' + environment.solarHost + '/api/mumble/on'
    );
  }

  mumbleOff() {
    return this.http.get<string>(
      'http://' + environment.solarHost + '/api/mumble/off'
    );
  }

  mumbleState() {
    // return this.http.get<string>(environment.solarURL + '/api/mumble');
    return this.http.get('http://' + environment.solarHost + '/api/mumble', {
      responseType: 'text',
    });
  }
}
