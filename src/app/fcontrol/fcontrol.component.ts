import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fcontrol',
  templateUrl: './fcontrol.component.html',
  styleUrls: ['./fcontrol.component.scss'],
})
export class FcontrolComponent implements OnInit {
  @Input() value: number = 0;

  value100000000 = '';
  value10000000 = '';
  value1000000 = '';
  value100000 = '';
  value10000 = '';
  value1000 = '';
  value100 = '';
  value10 = '';
  value1 = '';

  constructor() {}

  ngOnInit(): void {
    this.setDigits();
  }

  updateFrequency(updateAmount: number) {
    console.log(updateAmount);
    this.value += updateAmount;
    this.setDigits();
  }

  setDigits() {
    let strValue = this.padWithZero(this.value, 9);
    console.log(strValue);
    this.value100000000 = strValue.substring(0, 1);
    this.value10000000 = strValue.substring(1, 2);
    this.value1000000 = strValue.substring(2, 3);
    this.value100000 = strValue.substring(3, 4);
    this.value10000 = strValue.substring(4, 5);
    this.value1000 = strValue.substring(5, 6);
    this.value100 = strValue.substring(6, 7);
    this.value10 = strValue.substring(7, 8);
    this.value1 = strValue.substring(8, 9);
  }

  padWithZero(num: number, targetLength: number) {
    return String(num).padStart(targetLength, '0');
  }
}
