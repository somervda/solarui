import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fdigit',
  templateUrl: './fdigit.component.html',
  styleUrls: ['./fdigit.component.scss'],
})
export class FdigitComponent implements OnInit {
  @Input() value: string = '';
  @Input() scale: string = '1';
  _scale: number = 1;

  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this._scale = parseInt(this.scale);
  }

  valueUp() {
    this.onChange.emit(this._scale);
  }
  valueDown() {
    this.onChange.emit(this._scale * -1);
  }
}
