import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-fdigit',
  templateUrl: './fdigit.component.html',
  styleUrls: ['./fdigit.component.scss'],
})
export class FdigitComponent implements OnInit, OnChanges {
  @Input() value: string = '';
  @Input() scale: string = '1';
  _scale: number = 1;

  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this._scale = parseInt(this.scale);
  }

  ngOnChanges(changes: any) {
    // console.log('fdigit Changes', changes);
    this.value = changes.value.currentValue;
  }

  valueUp() {
    this.onChange.emit(this._scale);
  }
  valueDown() {
    this.onChange.emit(this._scale * -1);
  }
}
