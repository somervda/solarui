import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  RenogyService,
  RenogyStatus,
  RenogyHistory,
} from '../services/renogy.service';
import { ChartType } from 'angular-google-charts';
import { Cache, CacheService } from '../services/cache.service';
import { MatRadioChange } from '@angular/material/radio';
import { WebcamService } from '../services/webcam.service';

@Component({
  selector: 'app-renogy',
  templateUrl: './renogy.component.html',
  styleUrls: ['./renogy.component.scss'],
})
export class RenogyComponent implements OnInit, OnDestroy {
  renogystatus$: Observable<RenogyStatus> | undefined;
  cache$: Observable<Cache> | undefined;
  webcam$: Observable<string> | undefined;
  webcam$$: Subscription | undefined;
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

  onWebcam() {
    this.webcam$ = this.webcamService.webcamOn();
    this.webcam$$ = this.webcam$.subscribe((response) => {
      this.cache$ = this.cacheService.getCache();
    });
  }

  historyChange($event: MatRadioChange) {
    this.getHistory($event.value);
  }

  getHistory(historyDays: number) {
    this.renogyhistory$ = this.renogyService.getHistory(historyDays);
    this.renogyhistory$$ = this.renogyhistory$.subscribe((hourlyHistory) => {
      this.processHourlyHistory(historyDays, hourlyHistory);
    });
  }
  processHourlyHistory(historyDays: number, hourlyHistory: any[]) {
    // Copy the hourlyHistory array to history using JSON/JSON trick
    let historyData: any[] = JSON.parse(JSON.stringify(hourlyHistory));
    // console.log(historyData);
    if (historyDays > 20) {
      // Summarize the data into daily buckets if we are looking at many days of data
      // Create a new array of daily totals
      let day1 = true;
      let lastDay = new Date(historyData[0][0] * 1000).getDate();
      let lastEpochDate = historyData[0][0];
      // console.log('lastDate:', lastDay, lastEpochDate);
      let batteryLevel = 0;
      let solarPower = 0;
      let outputPower = 0;
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
            dayItem.push(
              lastEpochDate,
              batteryLevel / hourCounter,
              solarPower,
              outputPower
            );
            dayHistory.push(JSON.parse(JSON.stringify(dayItem)));
          } else {
            day1 = false;
          }
          batteryLevel = 0;
          solarPower = 0;
          outputPower = 0;
          hourCounter = 0;
          lastDay = new Date(historyItem[0] * 1000).getDate();
          lastEpochDate = historyItem[0];
        }
        batteryLevel += historyItem[1];
        solarPower += historyItem[2];
        outputPower += historyItem[3];
        hourCounter += 1;
      });
      // if (hourCounter > 0) {
      //   let dayItem = [];
      //   dayItem.push(
      //     lastEpochDate,
      //     batteryLevel / hourCounter,
      //     solarPower / hourCounter,
      //     outputPower / hourCounter
      //   );
      //   dayHistory.push(JSON.parse(JSON.stringify(dayItem)));
      // }
      // console.log('dayHistory:', dayHistory);
      this.chartData = JSON.parse(JSON.stringify(dayHistory));
    } else {
      this.chartData = JSON.parse(JSON.stringify(historyData));
    }
    // Convert epoch date to a javascript date, need to
    // do this after processing (JSON/JSON trick messes with dates)
    this.chartData.forEach((chartItem) => {
      chartItem[0] = new Date(chartItem[0] * 1000);
    });
  }

  ngOnDestroy() {
    // Clean up hanging subscriptions to observables
    if (this.renogyhistory$$) {
      this.renogyhistory$$.unsubscribe();
    }
  }
}
