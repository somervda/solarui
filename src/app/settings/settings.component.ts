import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService, Cache } from '../services/cache.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  cache$: Observable<Cache> | undefined;

  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {
    this.cache$ = this.cacheService.getCache();
  }
}
