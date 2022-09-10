import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-fcontrol',
  templateUrl: './fcontrol.component.html',
  styleUrls: ['./fcontrol.component.scss'],
})
export class FcontrolComponent implements OnInit, OnChanges {
  @Input() value: number = 0;
  @Input() minimum: number = 0;
  @Input() maximum: number = 0;
  @Output() onChange = new EventEmitter();

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

  ngOnChanges(changes: any) {
    console.log('fcontrol Changes', changes);
    if (changes.value) this.value = changes.value.currentValue;
    if (changes.minimum) this.minimum = changes.minimum.currentValue;
    if (changes.maximum) this.maximum = changes.maximum.currentValue;
    this.setDigits();
  }

  updateFrequency(updateAmount: number) {
    // console.log(updateAmount);
    let newValue = this.value + updateAmount;
    if (newValue <= this.maximum && newValue >= this.minimum) {
      this.value += updateAmount;
      this.setDigits();
      this.onChange.emit(this.value);
    }
  }

  setDigits() {
    let strValue = this.padWithZero(this.value, 9);
    // console.log(strValue);
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
