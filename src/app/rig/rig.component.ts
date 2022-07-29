import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Cache, CacheService } from '../services/cache.service';
import { RigService } from '../services/rig.service';

@Component({
  selector: 'app-rig',
  templateUrl: './rig.component.html',
  styleUrls: ['./rig.component.scss'],
})
export class RigComponent implements OnInit, OnDestroy {
  cache$: Observable<Cache> | undefined;
  rig$: Observable<string> | undefined;
  rig$$: Subscription | undefined;

  constructor(
    private cacheService: CacheService,
    private rigService: RigService
  ) {}

  ngOnInit(): void {
    this.cache$ = this.cacheService.getCache();
  }

  onRig() {
    // console.log('rig on');
    this.rig$ = this.rigService.rigOn();
    this.rig$$ = this.rig$.subscribe((response) => {
      this.cache$ = this.cacheService.getCache();
    });
  }
  offRig() {
    // console.log('rig off');
    this.rig$ = this.rigService.rigOff();
    this.rig$$ = this.rig$.subscribe((response) => {
      this.cache$ = this.cacheService.getCache();
    });
  }

  ngOnDestroy(): void {
    // Clean up hanging subscriptions to observables
    if (this.rig$$) {
      this.rig$$.unsubscribe();
    }
  }
}
