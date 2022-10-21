export interface BandInfoItem {
  sequence: number;
  band: number;
  name: string;
  start: number;
  end: number;
  description: string;
}

export const BandInfo: BandInfoItem[] = [
  {
    sequence: 8,
    band: 80,
    name: '80 Meters',
    start: 3500000,
    end: 4000000,
    description:
      'CW 3.525Mhz to 3.600Mhz (N,T)<br />' +
      'RTTY and Data 3.525Mhz to 3.600Mhz (G,A)<br />' +
      'Phone and Image 3.800Mhz to 4.000Mhz (G)<br />' +
      'Phone and Image 3.700Mhz to 4.000Mhz (A)<br />' +
      'RTTY and Data 3.500Mhz to 3.600Mhz (E)<br />' +
      'Phone and Image 3.600Mhz to 4.000Mhz (E)<br />' +
      'Note: LSB usually used for SSB, some AM used',
  },
  {
    sequence: 7,
    band: 60,
    name: '60 Meters',
    start: 5330500,
    end: 5366500,
    description:
      'Five sub-channels currently used for the 60-meter band in the USA (E,A,G) See details online',
  },
  {
    sequence: 6,
    band: 40,
    name: '40 Meters',
    start: 7000000,
    end: 7300000,
    description:
      'CW 7.025Mhz to 7.125Mhz (N,T)<br />' +
      'RTTY and Data 7.025Mhz to 7.125Mhz (G,A)<br />' +
      'RTTY and Data 7.000Mhz to 7.125Mhz (E)<br />' +
      'Phone and Image 7.175Mhz to 7.3Mhz (G)<br />' +
      'Phone and Image 7.125Mhz to 7.3Mhz (A,E)<br/>' +
      'Note: LSB usually used for SSB, some AM used',
  },
  {
    sequence: 5,
    band: 30,
    name: '30 Meters',
    start: 10100000,
    end: 10150000,
    description: 'Phone and Image 10.100Mhz to 10.150Mhz (E,A,G)',
  },
  {
    sequence: 4,
    band: 20,
    name: '20 Meters',
    start: 14000000,
    end: 14350000,
    description:
      'RTTY and Data 14.025Mhz to 14.150Mhz (G,A)<br />' +
      'RTTY and Data 14.000Mhz to 14.150Mhz (E)<br />' +
      'Phone and Image 14.225Mhz to 14.350Mhz (G)<br />' +
      'Phone and Image 14.175Mhz to 14.350Mhz (A)<br/>' +
      'Phone and Image 14.150Mhz to 14.350Mhz (E)<br/>' +
      'Note: USB usually used for SSB, some AM used',
  },
  {
    sequence: 3,
    band: 17,
    name: '17 Meters',
    start: 18068000,
    end: 18168000,
    description:
      'RTTY and Data 18.068Mhz to 18.110Mhz (E,A,G)<br />' +
      'Phone and Image 18.110Mhz to 18.168Mhz (E,A,G)<br />' +
      'Note: USB usually used for SSB, some AM used',
  },
  {
    sequence: 2,
    band: 15,
    name: '15 Meters',
    start: 21000000,
    end: 21450000,
    description:
      'CW 21.025Mhz to 21.200Mhz (N,T)<br />' +
      'RTTY and Data 21.025Mhz to 21.200Mhz (G,A)<br />' +
      'Phone and Image 21.275Mhz to 21.450Mhz (G)<br />' +
      'Phone and Image 21.225Mhz to 21.450Mhz (A)<br />' +
      'RTTY and Data 21.000Mhz to 21.200Mhz (E)<br />' +
      'Phone and Image 21.200Mhz to 21.450Mhz (E)<br />' +
      'Note: USB usually used for SSB, some AM used',
  },
  {
    sequence: 1,
    band: 10,
    name: '10 Meters',
    start: 28000000,
    end: 29700000,
    description:
      'RTTY and Data 28.00Mhz to 28.300Mhz (N,T,E,A,G)<br />' +
      'SSB 28.300Mhz to 28.500Mhz (N,T)<br />' +
      'Phone and Image 28.300Mhz to 29.700Mhz (E,A,G)<br />' +
      'Beacons: 28.200Mhz to 28.300Mhz<br />' +
      'Note: USB usually used for SSB, some AM used',
  },
];
