import { Injectable } from '@angular/core';
import { BandInfo, BandInfoItem } from '../models/band.model';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  getBandInfoItemByFrequency(frequency: number) {
    let bandInfoItem: BandInfoItem | undefined = undefined;
    BandInfo.forEach((bii) => {
      if (bii.start <= frequency && bii.end >= frequency) {
        bandInfoItem = JSON.parse(JSON.stringify(bii));
      }
    });
    return <BandInfoItem | undefined>bandInfoItem;
  }

  getBandInfoItemBySequence(sequence: number) {
    let bandInfoItem: BandInfoItem | undefined = undefined;
    BandInfo.forEach((bii) => {
      if (bii.sequence == sequence) {
        bandInfoItem = JSON.parse(JSON.stringify(bii));
      }
    });
    return <BandInfoItem | undefined>bandInfoItem;
  }

  getBandInfoItemByBand(band: number) {
    let bandInfoItem: BandInfoItem | undefined = undefined;
    BandInfo.forEach((bii) => {
      if (bii.band == band) {
        bandInfoItem = JSON.parse(JSON.stringify(bii));
      }
    });
    return <BandInfoItem | undefined>bandInfoItem;
  }
}
