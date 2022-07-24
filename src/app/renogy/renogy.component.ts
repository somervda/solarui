import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  RenogyService,
  RenogyStatus,
  RenogyHistory,
} from '../services/renogy.service';
import { ChartType } from 'angular-google-charts';
import { Cache, CacheService } from '../services/cache.service';

@Component({
  selector: 'app-renogy',
  templateUrl: './renogy.component.html',
  styleUrls: ['./renogy.component.scss'],
})
export class RenogyComponent implements OnInit, OnDestroy {
  renogystatus$: Observable<RenogyStatus> | undefined;
  cache$: Observable<Cache> | undefined;
  renogyhistory$: Observable<[[RenogyHistory]]> | undefined;
  renogyhistory$$: Subscription | undefined;
  // Google Charts
  showChart = true;
  chartResize = true;
  chartType = ChartType.ComboChart;
  chartColumns: string[] = ['Hour', 'Battery %', 'Solar Watts', 'Output Watts'];
  // See https://developers.google.com/chart/interactive/docs/gallery/combochart
  chartOptions = {
    legend: { position: 'bottom' },
    chartArea: { width: '90%', height: '70%' },
    hAxis: { title: 'Time' },
    // Note: for multiple axis vAxis is called vAxes !!!
    vAxis: { viewWindow: { min: 0 } },
    vAxes: {
      0: {
        title: 'Battery %',
        minValue: 0,
        maxValue: 100,
        gridlines: { count: 0 },
      },
      1: {
        title: 'Watts',
        minValue: 0,
        gridlines: { count: 0 },
      },
    },
    series: {
      0: { targetAxisIndex: 0 },
      1: { targetAxisIndex: 1 },
      2: { targetAxisIndex: 1 },
    },
    curveType: 'function',
    formatters: {},
  };
  chartData: any[] = [];

  constructor(
    private renogyService: RenogyService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.renogystatus$ = this.renogyService.getStatus();
    this.cache$ = this.cacheService.getCache();
    this.renogyhistory$ = this.renogyService.getHistory24();
    this.renogyhistory$$ = this.renogyhistory$.subscribe((historyData) => {
      // console.log(historyData);
      // console.log(this.chartData);
      this.chartData = JSON.parse(JSON.stringify(historyData));
      // Convert epoch date to a javascript date
      this.chartData.forEach((chartItem) => {
        chartItem[0] = new Date(chartItem[0] * 1000);
      });
    });
  }

  ngOnDestroy() {
    // Clean up hanging subscriptions to observables
    if (this.renogyhistory$$) {
      this.renogyhistory$$.unsubscribe();
    }
  }
}
