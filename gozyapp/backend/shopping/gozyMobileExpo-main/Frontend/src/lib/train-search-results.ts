export type TrainAvailability = {
  className: string;
  badge?: string;
  price: number;
  quotaLabel: string;
  status: string;
  updatedLabel: string;
};

export type TrainSearchResult = {
  id: string;
  name: string;
  number: string;
  runningDays: string[];
  departureTime: string;
  departureDateLabel: string;
  departureStation: string;
  duration: string;
  arrivalTime: string;
  arrivalDateLabel: string;
  arrivalStation: string;
  availability: TrainAvailability[];
  note?: string;
  nextRunLabel?: string;
};

export const trainResultFilterChips = [
  'Sort & Filter',
  'Departure',
  'Availability',
  'Duration',
  'Train Type',
] as const;

export const trainSearchResults: TrainSearchResult[] = [
  {
    id: 't-22504',
    name: 'Vivek Express',
    number: '22504',
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    departureTime: '01:30 PM',
    departureDateLabel: '28 May',
    departureStation: 'Srikakulam Road (CHE)',
    duration: '07h 40m',
    arrivalTime: '09:10 PM',
    arrivalDateLabel: '28 May',
    arrivalStation: 'Vijayawada Jn (BZA)',
    availability: [
      {
        className: '2A',
        badge: 'TATKAL',
        price: 1610,
        quotaLabel: 'Available 15',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 2 days ago',
      },
      {
        className: '2A',
        price: 1155,
        quotaLabel: 'RLWL 6',
        status: 'Confirm or 3x Refund',
        updatedLabel: 'Updated 11 hrs ago',
      },
      {
        className: '3A',
        price: 1365,
        quotaLabel: 'RLWL 12',
        status: 'Confirm or 3x Refund',
        updatedLabel: 'Updated 1 hr ago',
      },
    ],
  },
  {
    id: 't-12703',
    name: 'Falaknuma Exp',
    number: '12703',
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    departureTime: '08:12 PM',
    departureDateLabel: '28 May',
    departureStation: 'Srikakulam Road (CHE)',
    duration: '07h 48m',
    arrivalTime: '04:00 AM',
    arrivalDateLabel: '29 May',
    arrivalStation: 'Vijayawada Jn (BZA)',
    availability: [
      {
        className: '3E',
        price: 775,
        quotaLabel: 'RLWL 17',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 5 hrs ago',
      },
      {
        className: 'SL',
        price: 330,
        quotaLabel: 'RLWL 64',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 1 hr ago',
      },
      {
        className: '1A',
        price: 2230,
        quotaLabel: 'RLWL 2',
        status: 'Confirm or 3x Refund',
        updatedLabel: 'Updated 1 hr ago',
      },
    ],
  },
  {
    id: 't-20694',
    name: 'Jodhpur Exp',
    number: '20694',
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    departureTime: '12:03 AM',
    departureDateLabel: '23 Apr',
    departureStation: 'Yeshvantpur Jn (YPR)',
    duration: '29h 27m',
    arrivalTime: '05:30 AM',
    arrivalDateLabel: '24 Apr',
    arrivalStation: 'Ahmedabad Jn (ADI)',
    note: 'Trip Guarantee is now Alternate Trip Plan',
    availability: [
      {
        className: 'SL',
        badge: 'TATKAL',
        price: 950,
        quotaLabel: 'TQWL 36',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 22 hrs ago',
      },
      {
        className: 'SL',
        price: 750,
        quotaLabel: 'GNWL 155',
        status: 'Confirm or 3x Refund',
        updatedLabel: 'Updated 18 hrs ago',
      },
      {
        className: '3A',
        price: 1895,
        quotaLabel: 'TQWL 9',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 19 hrs ago',
      },
    ],
  },
  {
    id: 't-16587',
    name: 'Bikaner Express',
    number: '16587',
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S'],
    departureTime: '07:10 AM',
    departureDateLabel: '23 Apr',
    departureStation: 'SMVT Bengaluru (SMVB)',
    duration: '31h 05m',
    arrivalTime: '02:15 PM',
    arrivalDateLabel: '24 Apr',
    arrivalStation: 'Ahmedabad Jn (ADI)',
    availability: [
      {
        className: 'SL',
        price: 780,
        quotaLabel: 'AVAILABLE 41',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 1 hr ago',
      },
      {
        className: '3A',
        badge: 'Free Cancellation',
        price: 2120,
        quotaLabel: 'AVAILABLE 12',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 1 hr ago',
      },
      {
        className: '2A',
        price: 3090,
        quotaLabel: 'RAC 3',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 1 hr ago',
      },
    ],
  },
  {
    id: 't-19416',
    name: 'Ahmedabad Express',
    number: '19416',
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    departureTime: '08:45 PM',
    departureDateLabel: '23 Apr',
    departureStation: 'KSR Bengaluru (SBC)',
    duration: '27h 50m',
    arrivalTime: '12:35 AM',
    arrivalDateLabel: '25 Apr',
    arrivalStation: 'Ahmedabad Jn (ADI)',
    nextRunLabel: 'Next runs on Thu, 23 Apr',
    availability: [
      {
        className: 'SL',
        price: 690,
        quotaLabel: 'AVAILABLE 86',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 45 mins ago',
      },
      {
        className: '3A',
        badge: 'Free Cancellation',
        price: 1840,
        quotaLabel: 'AVAILABLE 18',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 45 mins ago',
      },
      {
        className: '2A',
        price: 2690,
        quotaLabel: 'AVAILABLE 6',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 45 mins ago',
      },
    ],
  },
  {
    id: 't-22689',
    name: 'YPR Jaipur Weekly',
    number: '22689',
    runningDays: ['T', 'F'],
    departureTime: '06:40 PM',
    departureDateLabel: '23 Apr',
    departureStation: 'Yeshvantpur Jn (YPR)',
    duration: '32h 10m',
    arrivalTime: '02:50 AM',
    arrivalDateLabel: '25 Apr',
    arrivalStation: 'Sabarmati BG (SBIB)',
    availability: [
      {
        className: '3A',
        price: 2015,
        quotaLabel: 'WL 14',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 2 hrs ago',
      },
      {
        className: '2A',
        price: 2860,
        quotaLabel: 'RAC 7',
        status: 'Confirm or 3x Refund',
        updatedLabel: 'Updated 2 hrs ago',
      },
    ],
  },
  {
    id: 't-22933',
    name: 'Karnavati Link',
    number: '22933',
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    departureTime: '02:35 PM',
    departureDateLabel: '23 Apr',
    departureStation: 'Bengaluru Cantt (BNC)',
    duration: '30h 15m',
    arrivalTime: '08:50 PM',
    arrivalDateLabel: '24 Apr',
    arrivalStation: 'Ahmedabad Jn (ADI)',
    availability: [
      {
        className: 'SL',
        price: 720,
        quotaLabel: 'GNWL 48',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 3 hrs ago',
      },
      {
        className: '3A',
        badge: 'Free Cancellation',
        price: 1760,
        quotaLabel: 'AVAILABLE 23',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 3 hrs ago',
      },
      {
        className: '2A',
        price: 2585,
        quotaLabel: 'AVAILABLE 9',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 3 hrs ago',
      },
    ],
  },
  {
    id: 't-11021',
    name: 'Mysuru Udaipur Humsafar',
    number: '11021',
    runningDays: ['W', 'S'],
    departureTime: '10:20 PM',
    departureDateLabel: '23 Apr',
    departureStation: 'KSR Bengaluru (SBC)',
    duration: '29h 55m',
    arrivalTime: '04:15 AM',
    arrivalDateLabel: '25 Apr',
    arrivalStation: 'Ahmedabad Jn (ADI)',
    availability: [
      {
        className: 'SL',
        price: 735,
        quotaLabel: 'AVAILABLE 52',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 55 mins ago',
      },
      {
        className: '3A',
        badge: 'Free Cancellation',
        price: 1715,
        quotaLabel: 'AVAILABLE 16',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 55 mins ago',
      },
      {
        className: '2A',
        price: 2495,
        quotaLabel: 'RAC 4',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 55 mins ago',
      },
    ],
  },
  {
    id: 't-14805',
    name: 'Adi Superfast',
    number: '14805',
    runningDays: ['M', 'W', 'F', 'S'],
    departureTime: '05:55 AM',
    departureDateLabel: '23 Apr',
    departureStation: 'Yelahanka Jn (YNK)',
    duration: '28h 40m',
    arrivalTime: '10:35 AM',
    arrivalDateLabel: '24 Apr',
    arrivalStation: 'Sabarmati BG (SBIB)',
    availability: [
      {
        className: 'SL',
        price: 705,
        quotaLabel: 'GNWL 27',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 90 mins ago',
      },
      {
        className: '3A',
        price: 1680,
        quotaLabel: 'AVAILABLE 21',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 90 mins ago',
      },
      {
        className: '2A',
        badge: 'Free Cancellation',
        price: 2410,
        quotaLabel: 'AVAILABLE 8',
        status: 'Free Cancellation',
        updatedLabel: 'Updated 90 mins ago',
      },
    ],
  },
];
