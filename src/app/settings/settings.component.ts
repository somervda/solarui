import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { CacheService, Cache } from '../services/cache.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  cache$: Observable<Cache>;
  cache$$: Subscription;

  cacheForm: FormGroup;
  testForm: FormGroup;
  cache: Cache | undefined;

  constructor(private cacheService: CacheService, private fb: FormBuilder) {
    this.cache$ = this.cacheService.getCache();
    this.cache$$ = this.cache$.subscribe((cache) => {
      this.cache = cache;
      this.cacheForm.patchValue(this.cache);
      // console.log('this.cache:', this.cache, this.cacheForm);
    });
    this.cacheForm = this.fb.group({
      powerSaveLevel: [
        this.cache?.powerSaveLevel,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      webcamExpiryMinutes: [
        this.cache?.webcamExpiryMinutes,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(180),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      rigExpiryMinutes: [
        this.cache?.rigExpiryMinutes,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(180),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      webcamRunAtNight: [this.cache?.webcamRunAtNight, [Validators.required]],
      webcamTurnOffTime: [this.cache?.webcamTurnOffTime],
    });

    this.testForm = this.fb.group({
      name: '',
      address: '',
    });
  }

  ngOnInit(): void {}

  update(): void {
    // console.log('update', this.cacheForm);
    if (this.cacheForm.invalid == false)
      for (const field in this.cacheForm.controls) {
        const control = this.cacheForm.controls[field];
        if (control.touched) {
          // console.log(field, control);
          switch (field) {
            case 'powerSaveLevel':
              this.cacheService
                .powerSaveLevel(control.value)
                .subscribe(() => {});
              break;
            case 'webcamExpiryMinutes':
              this.cacheService
                .webcamExpiryMinutes(control.value)
                .subscribe(() => {});
              break;
            case 'rigExpiryMinutes':
              this.cacheService
                .rigExpiryMinutes(control.value)
                .subscribe(() => {});
              break;
            case 'webcamTurnOffTime':
              let _value = null;
              if (control.value != '') {
                _value = control.value;
              }
              this.cacheService.webcamTurnOffTime(_value).subscribe(() => {});
              break;
            case 'webcamRunAtNight':
              this.cacheService
                .webcamRunAtNight(control.value == '0' ? false : true)
                .subscribe(() => {});
              break;
            default:
          }
        }
      }
  }

  wranComparisonFunction = function (option: string, value: boolean): boolean {
    // Needed to compare objects in select drop downs because of representation and datatype differences
    // Note: Selection options always stores values as strings
    // console.log('compare', typeof option, typeof value);
    if (option == null && value == null) {
      return true;
    }
    let _option = option == '0' ? false : true;
    return _option == value;
  };

  wtotComparisonFunction = function (option: string, value: number): boolean {
    // Needed to compare objects in select drop downs because of representation and datatype differences
    // Note: Selection options always stores values as strings
    // console.log('compare', typeof option, typeof value);
    if (value == null) {
      return option == 'None';
    } else {
      return option == value.toString();
    }
  };

  ngOnDestroy(): void {}
}
