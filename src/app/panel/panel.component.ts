import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  RenogyService,
  RenogyStatus,
  PanelHistory,
} from '../services/renogy.service';
import { ChartType } from 'angular-google-charts';
import { Cache, CacheService } from '../services/cache.service';
import { MatRadioChange } from '@angular/material/radio';
import { WebcamService } from '../services/webcam.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {
  renogystatus$: Observable<RenogyStatus> | undefined;
  cache$: Observable<Cache> | undefined;
  webcam$: Observable<string> | undefined;
  webcam$$: Subscription | undefined;
  panelhistory$: Observable<[[PanelHistory]]> | undefined;
  panelhistory$$: Subscription | undefined;

  // Google Charts
  showChart = false;
  chartResize = true;
  chartType = ChartType.ComboChart;
  chartColumns: string[] = ['Hour', 'Panel Volts', 'Boost %', 'Float %'];
  // See https://developers.google.com/chart/interactive/docs/gallery/combochart
  chartOptions = {
    legend: { position: 'bottom' },
    chartArea: { width: '90%', height: '70%' },
    hAxis: { title: 'Time' },
    // Note: for multiple axis vAxis is called vAxes !!!
    vAxis: { viewWindow: { min: 0 } },
    vAxes: {
      0: {
        title: 'Mode %',
        minValue: 0,
        maxValue: 100,
        gridlines: { count: 0 },
      },
      1: {
        title: 'Volts',
        minValue: 0,
        gridlines: { count: 0 },
      },
    },
    isStacked: true,
    series: {
      0: { targetAxisIndex: 1 },
      1: { targetAxisIndex: 0, type: 'area' },
      2: { targetAxisIndex: 0, type: 'area' },
    },
    // curveType: 'function',
    formatters: {},
  };
  chartData: any[] = [];

  constructor(
    private renogyService: RenogyService,
    private cacheService: CacheService,
    private webcamService: WebcamService
  ) {}

  ngOnInit(): void {
    this.renogystatus$ = this.renogyService.getStatus();
    this.cache$ = this.cacheService.getCache();
    this.getHistory(1);
  }

  historyChange($event: MatRadioChange) {
    this.getHistory($event.value);
  }

  getHistory(historyDays: number) {
    this.panelhistory$ = this.renogyService.getPanelHistory(historyDays);
    this.panelhistory$$ = this.panelhistory$.subscribe((hourlyHistory) => {
      this.processHourlyHistory(historyDays, hourlyHistory);
    });
  }
  processHourlyHistory(historyDays: number, hourlyHistory: any[]) {
    // Copy the hourlyHistory array to history using JSON/JSON trick
    let historyData: any[] = JSON.parse(JSON.stringify(hourlyHistory));
    console.log(historyData);
    if (historyDays > 20) {
      // Summarize the data into daily buckets if we are looking at many days of data
      // Create a new array of daily totals
      let day1 = true;
      let lastDay = new Date(historyData[0][0] * 1000).getDate();
      let lastEpochDate = historyData[0][0];
      console.log('lastDate:', lastDay, lastEpochDate);
      let solarVolts = 0;
      let boostPct = 0;
      let floatPct = 0;
      let hourCounter = 0;
      let dayHistory: any[] = [];
      historyData.forEach((historyItem) => {
        // console.log(
        //   new Date(historyItem[0] * 1000).getDate() != lastDay,
        //   new Date(historyItem[0] * 1000).getDate(),
        //   lastDay
        // );
        if (new Date(historyItem[0] * 1000).getDate() != lastDay) {
          // Change of day - write out dayHistory
          if (!day1) {
            let dayItem = [];
            let solarHours = (boostPct + floatPct) / 100;
            if (solarHours == 0) {
              solarHours = 24;
            }
            dayItem.push(
              lastEpochDate,
              solarVolts / solarHours,
              boostPct / 24,
              floatPct / 24
            );
            console.log(dayHistory);
            dayHistory.push(JSON.parse(JSON.stringify(dayItem)));
          } else {
            day1 = false;
          }
          solarVolts = 0;
          boostPct = 0;
          floatPct = 0;
          hourCounter = 0;
          lastDay = new Date(historyItem[0] * 1000).getDate();
          lastEpochDate = historyItem[0];
        }
        solarVolts += historyItem[1];
        boostPct += historyItem[2];
        floatPct += historyItem[3];
        hourCounter += 1;
      });
      // if (hourCounter > 0) {
      //   let dayItem = [];
      //   dayItem.push(
      //     lastEpochDate,
      //     batteryLevel / hourCounter,
      //     solarPower / hourCounter,
      //     floatPct / hourCounter
      //   );
      //   dayHistory.push(JSON.parse(JSON.stringify(dayItem)));
      // }
      // console.log('dayHistory:', dayHistory);
      this.chartData = JSON.parse(JSON.stringify(dayHistory));
      // console.log(this.chartData);
    } else {
      this.chartData = JSON.parse(JSON.stringify(historyData));
    }
    // Convert epoch date to a javascript date, need to
    // do this after processing (JSON/JSON trick messes with dates)
    this.chartData.forEach((chartItem) => {
      chartItem[0] = new Date(chartItem[0] * 1000);
    });
    if (this.chartData.length == 0) {
      this.showChart = false;
    } else {
      this.showChart = true;
    }
  }

  ngOnDestroy() {
    // Clean up hanging subscriptions to observables
    if (this.panelhistory$$) {
      this.panelhistory$$.unsubscribe();
    }
  }
}
