import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Cache, CacheService } from '../services/cache.service';
import { RigService } from '../services/rig.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { RigctlService } from '../services/rigctl.service';

@Component({
  selector: 'app-rig',
  templateUrl: './rig.component.html',
  styleUrls: ['./rig.component.scss'],
})
export class RigComponent implements OnInit, OnDestroy {
  cache$: Observable<Cache> | undefined;
  rig$: Observable<string | never[]> | undefined;
  rig$$: Subscription | undefined;

  // Rig settings
  rigFrequency: number = 0;
  rigMode: string = '';
  rigBand: string = '';
  showSpinner=false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private cacheService: CacheService,
    private rigService: RigService,
    private snackBar: MatSnackBar,
    private rigctlService: RigctlService
  ) {}

  ngOnInit(): void {
    this.cache$ = this.cacheService.getCache();
  }

  onRig() {
    // console.log('rig on');
    this.showSpinner=true;
    this.rig$ = this.rigService.rigOn();
    this.rig$$ = this.rig$.subscribe(
      (response) => {
        this.showSpinner=false;
        this.cache$ = this.cacheService.getCache();
        this.updateStatus();
      },
      (error) => {
        this.showSpinner=false;
        this.snackBar.open(error.error, 'Close', {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    );
  }

  offRig() {
    // console.log('rig off');
    this.showSpinner=true;
    this.rig$ = this.rigService.rigOff();
    this.rig$$ = this.rig$.subscribe((response) => {
      this.showSpinner=false;
      this.cache$ = this.cacheService.getCache();
    });
  }

  updateStatus() {
    // get the current settings on the rig
    this.rigctlService.rigctl('get_freq').subscribe((response) => {
      this.rigFrequency = parseInt(response);
      this.rigBand = this.freqToBand(this.rigFrequency);
    });
    this.rigctlService.rigctl('get_mode').subscribe((response) => {
      this.rigMode = response;
    });
  }

  freqToBand(frequency: number) {
    if (frequency >= 28000000 && frequency <= 29700000) return '10 Meter';
    if (frequency >= 21000000 && frequency <= 21450000) return '15 Meter';
    if (frequency >= 18068000 && frequency <= 18168000) return '17 Meter';
    if (frequency >= 14000000 && frequency <= 14350000) return '20 Meter';
    if (frequency >= 10100000 && frequency <= 10150000) return '30 Meter';
    if (frequency >= 7000000 && frequency <= 7300000) return '40 Meter';
    if (frequency >= 5300000 && frequency <= 5405000) return '60 Meter';
    if (frequency >= 3500000 && frequency <= 4000000) return '80 Meter';
    return 'Unknown';
  }

  ngOnDestroy(): void {
    // Clean up hanging subscriptions to observables
    if (this.rig$$) {
      this.rig$$.unsubscribe();
    }
  }
}
