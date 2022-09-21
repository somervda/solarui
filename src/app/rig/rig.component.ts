import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { Cache, CacheService } from '../services/cache.service';
import { RigService } from '../services/rig.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { RigctlService } from '../services/rigctl.service';
import { BandInfo, BandInfoItem } from '../models/band.model';
import { HelperService } from '../services/helper.service';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';

@Component({
  selector: 'app-rig',
  templateUrl: './rig.component.html',
  styleUrls: ['./rig.component.scss'],
})
export class RigComponent implements OnInit, OnDestroy {
  cache$: Observable<Cache> | undefined;
  cache$$: Subscription | undefined;
  rig$: Observable<string | never[]> | undefined;
  rig$$: Subscription | undefined;

  // Rig settings
  rigFrequency: number = 0;
  rigMode = 'CW';
  rigPassband = '';
  rigBandDescription: string = '';
  rigBand: number = -1;
  rigBandMinimum = -1;
  rigBandMaximum = -1;
  rigPTT = false;
  showSpinner = false;
  // spinnerMsg = '';
  bandInfo = BandInfo;
  bandInfoItem: BandInfoItem | undefined = undefined;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  mumbleCmd =
    '"C:\\Program Files\\Mumble\\client\\mumble.exe" mumble://solarui:@rpi3.home';

  constructor(
    private cacheService: CacheService,
    private rigService: RigService,
    private snackBar: MatSnackBar,
    private rigctlService: RigctlService,
    private helper: HelperService
  ) {
    // console.log('constructor');
  }

  ngOnInit(): void {
    // console.log('ngOnInit');
    this.cache$ = this.cacheService.getCache();
    this.cache$$ = this.cache$.subscribe((cache) => {
      console.log('ngOnInit cache$$');
      if (cache.rigOn == true) {
        this.getRigSettings();
      }
    });
  }

  onFrequencyChange(frequency: number) {
    this.rigctlService
      .rigctl('set_freq ' + frequency.toString())
      .subscribe((response) => {
        console.log('updateFrequency:', frequency);
        this.getRigSettings();
      });
  }

  onModeChange() {
    console.log('onModeChange', this.rigMode);
    this.rigctlService
      .rigctl('set_mode ' + this.rigMode + ' 0')
      .subscribe((response) => {
        this.getRigSettings();
      });
  }

  onBandChange() {
    console.log('onBandChange', this.rigBand);
    let bandInfoItem = this.helper.getBandInfoItemByBand(this.rigBand);
    if (bandInfoItem) this.onFrequencyChange(bandInfoItem.start);
  }

  onPTT() {
    // Flip PTT setting
    console.log('set_ptt ' + (this.rigPTT ? '0' : '1'));
    this.rigctlService
      .rigctl('set_ptt ' + (this.rigPTT ? '0' : '1'))
      .subscribe((response) => {
        // this.rigFrequency = parseInt(response);
        console.log("set_ptt:'" + response + "'");
        this.rigPTT = !this.rigPTT;
      });
  }

  onRig() {
    // console.log('rig on');
    this.showSpinner = true;
    // this.spinnerMsg = 'Turning on rig...';
    this.rig$ = this.rigService.rigOn();
    this.rig$$ = this.rig$.subscribe(
      (response) => {
        this.showSpinner = false;
        // this.spinnerMsg = '';
        this.cache$ = this.cacheService.getCache();
        this.getRigSettings();
      },
      (error) => {
        this.showSpinner = false;
        this.snackBar.open(error.error, 'Close', {
          duration: 5000,
        });
      }
    );
  }

  offRig() {
    // console.log('rig off');
    this.showSpinner = true;
    // this.spinnerMsg = 'Turning off rig...';
    this.rig$ = this.rigService.rigOff();
    this.rig$$ = this.rig$.subscribe((response) => {
      this.showSpinner = false;
      // this.spinnerMsg = '';
      this.cache$ = this.cacheService.getCache();
    });
  }

  getRigSettings() {
    // get the current settings on the rig
    this.rigctlService.rigctl('get_freq').subscribe((response) => {
      this.rigFrequency = parseInt(response);
      console.log("rigFrequency:'" + this.rigFrequency + "'");
      this.freqToBand(this.rigFrequency);
    });
    this.rigctlService.rigctl('get_mode').subscribe((response) => {
      let modeDetails = response.split('\n');
      if ((modeDetails.length = 2)) {
        this.rigMode = modeDetails[0];
        this.rigPassband = modeDetails[1];
        console.log(modeDetails);
      }
      this.rigctlService.rigctl('get_ptt').subscribe((response) => {
        // this.rigFrequency = parseInt(response);
        console.log("get_ptt:'" + response + "'");
        if (response.replace('\n', '') == '0') {
          this.rigPTT = false;
        } else {
          this.rigPTT = true;
        }
      });
    });
  }

  freqToBand(frequency: number) {
    let bandInfoItem = this.helper.getBandInfoItemByFrequency(frequency);
    console.log('bandInfoItem:', bandInfoItem);
    if (bandInfoItem) {
      this.rigBand = bandInfoItem.band;
      this.rigBandDescription = bandInfoItem.description;
      this.rigBandMinimum = bandInfoItem.start;
      this.rigBandMaximum = bandInfoItem.end;
    } else {
      // Shouldn't get this unless manually set freq on uSDX
      this.rigBand = -1;
      this.rigBandDescription = '';
      this.rigBandMinimum = -1;
      this.rigBandMaximum = -1;
    }
  }

  copyCmd() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.mumbleCmd;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnDestroy(): void {
    // Clean up hanging subscriptions to observables
    if (this.rig$$) {
      this.rig$$.unsubscribe();
    }
    if (this.cache$$) {
      this.cache$$.unsubscribe();
    }
  }
}
