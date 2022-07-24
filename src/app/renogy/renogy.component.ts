import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RenogyService,
  RenogyStatus,
  RenogyHistory,
} from '../services/renogy.service';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-renogy',
  templateUrl: './renogy.component.html',
  styleUrls: ['./renogy.component.scss'],
})
export class RenogyComponent implements OnInit {
  renogystatus$: Observable<RenogyStatus>;
  renogyhistory$: Observable<[[RenogyHistory]]>;
  // Google Charts
  showChart = true;
  chartResize = true;
  chartType = ChartType.LineChart;
  chartColumns: string[] = ['Hour', 'Battery', 'Solar', 'Load'];
  chartOptions = {
    legend: { position: 'bottom' },
    chartArea: { width: '90%', height: '70%' },
  };
  chartData = [];

  constructor(private renogyService: RenogyService) {
    this.renogystatus$ = this.renogyService.getStatus();
    this.renogyhistory$ = this.renogyService.getHistory24();
    this.renogyhistory$.subscribe((response) => {
      console.log(response);
      console.log(this.chartData);
      this.chartData = JSON.parse(JSON.stringify(response));
    });
  }

  ngOnInit(): void {}
}
