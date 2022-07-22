import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RenogyService, RenogyStatus } from '../services/renogy.service';

@Component({
  selector: 'app-renogy',
  templateUrl: './renogy.component.html',
  styleUrls: ['./renogy.component.scss'],
})
export class RenogyComponent implements OnInit {
  renogystatus$: Observable<RenogyStatus>;

  constructor(private renogyService: RenogyService) {
    this.renogystatus$ = this.renogyService.getStatus();
  }

  ngOnInit(): void {}
}
