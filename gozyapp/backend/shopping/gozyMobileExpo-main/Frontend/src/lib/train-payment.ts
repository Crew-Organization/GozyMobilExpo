import type { ReviewBookingDraft, RecentBooking } from '@/src/store/train-search-store';

export function buildRecentTrainBooking(booking: ReviewBookingDraft): RecentBooking {
  const generatedBookingId = 'NR' + Math.floor(1000000000000000 + Math.random() * 9000000000000000);
  const fromCity = booking.train.departureStation.split(' ')[0] || 'From';
  const toCity = booking.train.arrivalStation.split(' ')[0] || 'To';
  const generatedPnr = '683' + Math.floor(1000000 + Math.random() * 9000000);

  return {
    id: 'rb-' + Math.random().toString(36).slice(2, 9),
    bookingId: generatedBookingId,
    pnr: generatedPnr,
    trainName: booking.train.name.toUpperCase(),
    trainNumber: booking.train.number,
    routeText: `${fromCity} - ${toCity}`,
    dateText: booking.train.departureDateLabel,
    priceText: `\u20B9 ${booking.totalPrice}`,
    freeCancellation: booking.freeCancellationFee > 0,
    tripGuarantee: booking.tripGuaranteeFee > 0,
    passengerNames: booking.passengers.map((passenger) => passenger.name),
    email: booking.email,
    phone: booking.phone,
    classCode: booking.slot.className,
    departureTime: booking.train.departureTime,
    arrivalTime: booking.train.arrivalTime,
    departureStation: booking.train.departureStation,
    arrivalStation: booking.train.arrivalStation,
    duration: booking.train.duration,
  };
}
