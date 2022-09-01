import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fcontrol',
  templateUrl: './fcontrol.component.html',
  styleUrls: ['./fcontrol.component.scss'],
})
export class FcontrolComponent implements OnInit {
  @Input() value: string = '';
  value10 = '';
  value1 = '';

  constructor() {}

  ngOnInit(): void {
    this.setDigits();
  }

  updateFrequency($event: number) {
    console.log($event);
    this.value = (parseInt(this.value) + $event).toString();
    console.log(this.value);
    this.setDigits();
  }

  setDigits() {
    this.value10 = this.value.substring(0, 1);
    this.value1 = this.value.substring(1, 2);
    console.log('Value10:', this.value10, ' Value1:', this.value1);
  }
}
