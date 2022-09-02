import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fcontrol',
  templateUrl: './fcontrol.component.html',
  styleUrls: ['./fcontrol.component.scss'],
})
export class FcontrolComponent implements OnInit {
  @Input() value: string = '';
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
    let value = parseInt(this.value) + updateAmount;
    this.value = this.padWithZero(value, 9);
    console.log(this.value);
    this.setDigits();
  }

  setDigits() {
    this.value100000000 = this.value.substring(0, 1);
    this.value10000000 = this.value.substring(1, 2);
    this.value1000000 = this.value.substring(2, 3);
    this.value100000 = this.value.substring(3, 4);
    this.value10000 = this.value.substring(4, 5);
    this.value1000 = this.value.substring(5, 6);
    this.value100 = this.value.substring(6, 7);
    this.value10 = this.value.substring(7, 8);
    this.value1 = this.value.substring(8, 9);
    console.log('Value10:', this.value10, ' Value1:', this.value1);
  }

  padWithZero(num: number, targetLength: number) {
    return String(num).padStart(targetLength, '0');
  }
}
